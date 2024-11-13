import dayjs from 'dayjs'
import { db } from '../db'
import { goals, goalsCompletions, users } from '../db/schema'
import { count, and, gte, lte, eq, sql } from 'drizzle-orm'

interface CreateGoalCompletionRequest {
  goalId: string
  userId: string
}

export async function CreateGoalsCompletions({
  goalId,
  userId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

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
          eq(goalsCompletions.goalId, goalId),
          eq(goals.userId, userId)
        )
      )
      .groupBy(goalsCompletions.goalId)
  )

  const result = await db
    .with(goalCompletionsCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql /*sql */`
        COALESCE(${goalCompletionsCounts.completionCount}, 0)`.mapWith(Number),
    })
    .from(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .leftJoin(goalCompletionsCounts, eq(goals.id, goalCompletionsCounts.goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week')
  }

  const isLastCompletionFromGoal =
    completionCount + 1 === desiredWeeklyFrequency

  const earnedExperience = isLastCompletionFromGoal ? 7 : 5

  const goalCompletion = await db.transaction(async tx => {
    const [goalCompletion] = await db
      .insert(goalsCompletions)
      .values({ goalId })
      .returning()

    await db
      .update(users)
      .set({
        experience: sql /*sql*/`
        ${users.experience} + ${earnedExperience}
      `,
      })
      .where(eq(users.id, userId))

    return goalCompletion
  })

  return { goalCompletion }
}
