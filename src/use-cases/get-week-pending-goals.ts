import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export interface GetWeekPendingGoalsRequest {
  userId: string
}

export async function getWeekPendingGoals({
  userId,
}: GetWeekPendingGoalsRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goaslCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
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

  const goalCompletionsCounts = db.$with('goal_completions_counts').as(
    db
      .select({
        goalId: goalsCompletions.goalId,
        completionCount: count(goalsCompletions.id).as('completionCount'),
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
      .groupBy(goalsCompletions.goalId)
  )

  const pendingGoals = db
    .with(goaslCreatedUpToWeek, goalCompletionsCounts)
    .select({
      id: goaslCreatedUpToWeek.id,
      title: goaslCreatedUpToWeek.title,
      desiredWeeklyFrequency: goaslCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql */`
        COALESCE(${goalCompletionsCounts.completionCount}, 0)`.mapWith(Number),
    })
    .from(goaslCreatedUpToWeek)
    .leftJoin(
      goalCompletionsCounts,
      eq(goalCompletionsCounts.goalId, goaslCreatedUpToWeek.id)
    )

  return { pendingGoals }
}
