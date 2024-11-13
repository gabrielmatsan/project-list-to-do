import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export interface GetWeekSummaryRequest {
  userId: string
  weekStartsAt: Date
}

export async function getWeekSummary({
  userId,
  weekStartsAt,
}: GetWeekSummaryRequest) {
  const firstDayOfWeek = weekStartsAt
  const lastDayOfWeek = dayjs(weekStartsAt).endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(and(lte(goals.createdAt, lastDayOfWeek), eq(goals.userId, userId)))
  )

  const goalsCompletedThisWeek = db.$with('goals_completed_this_week').as(
    db
      .select({
        id: goalsCompletions.id,
        title: goals.title,
        completedAtHour: goalsCompletions.createdAt,
        completedAtDate: sql /*sql*/`
          DATE(${goalsCompletions.createdAt})
        `.as('completedAtDate'),
      })
      .from(goalsCompletions)
      .innerJoin(goals, eq(goals.id, goalsCompletions.goalId))
      .where(
        and(
          gte(goalsCompletions.createdAt, firstDayOfWeek),
          lte(goalsCompletions.createdAt, lastDayOfWeek),
          eq(goals.userId, userId)
        )
      )
      .orderBy(desc(goalsCompletions.createdAt))
  )

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: goalsCompletedThisWeek.completedAtDate,
        completions: sql /*sql*/`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',${goalsCompletedThisWeek.id},
              'title',${goalsCompletedThisWeek.title},
              'completedAt',${goalsCompletedThisWeek.completedAtDate}
            )
          )
          `.as('completions'),
      })
      .from(goalsCompletedThisWeek)
      .groupBy(goalsCompletedThisWeek.completedAtDate)
      .orderBy(desc(goalsCompletedThisWeek.completedAtDate))
  )

  type GoalsPerDay = Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >

  const result = await db
    .with(goalsCreatedUpToWeek, goalsCompletedThisWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql /*sql*/`
        (SELECT COUNT(*) FROM ${goalsCompletedThisWeek})
      `.mapWith(Number),
      total: sql /*sql*/`
      (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})
    `.mapWith(Number),
      goalsPerDay: sql /*sql*/<GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `,
    })
    .from(goalsCompletedByWeekDay)

  return {
    summary: result[0],
  }
}
