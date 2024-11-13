import { db } from '../db'
import { goals } from '../db/schema'

interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
  userId: string
}

export async function CreateGoal({
  title,
  desiredWeeklyFrequency,
  userId,
}: CreateGoalRequest) {
  const [goal] = await db
    .insert(goals)
    .values({ title, desiredWeeklyFrequency, userId })
    .returning()

  return { goal }
}
