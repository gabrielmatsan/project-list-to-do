import { db } from '@/db'
import { goalsCompletions } from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export async function makeGoalCompletion(
  override: Partial<InferSelectModel<typeof goalsCompletions>> &
    Pick<InferSelectModel<typeof goalsCompletions>, 'goalId'>
) {
  const [row] = await db.insert(goalsCompletions).values(override).returning()

  return row
}
