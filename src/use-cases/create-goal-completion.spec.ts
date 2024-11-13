import { eq } from 'drizzle-orm'
import { makeGoal } from '../../tests/factories/make-goal'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'
import { makeUser } from '../../tests/factories/make-user'
import { CreateGoalsCompletions } from './create-goal-completions'
import { users } from '@/db/schema'
import { db } from '@/db'

describe('Create a goal Completion', () => {
  it('should be able to complete a goal', async () => {
    const user = await makeUser()

    const goal = await makeGoal({ userId: user.id })

    const result = await CreateGoalsCompletions({
      goalId: goal.id,
      userId: user.id,
    })

    expect(result).toEqual({
      goalCompletion: expect.objectContaining({
        id: expect.any(String),
        goalId: goal.id,
      }),
    })
  })
  it('should not be able to complete a goal more times than the desired weekly frequency', async () => {
    const user = await makeUser()
    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 1 })
    await makeGoalCompletion({ goalId: goal.id })

    await expect(
      CreateGoalsCompletions({
        goalId: goal.id,
        userId: user.id,
      })
    ).rejects.toThrow('Goal already completed this week')
  })
  it('should increase the user experience by 5 when completing a goal', async () => {
    const user = await makeUser({
      experience: 0,
    })

    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 5 })

    await CreateGoalsCompletions({
      goalId: goal.id,
      userId: user.id,
    })

    const [userOnDatabase] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))

    expect(userOnDatabase.experience).toEqual(5)
  })

  it('should increase the user experience by 7 when fully completing a goal', async () => {
    const user = await makeUser({
      experience: 0,
    })

    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 1 })

    await CreateGoalsCompletions({
      goalId: goal.id,
      userId: user.id,
    })

    const [userOnDatabase] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))

    expect(userOnDatabase.experience).toEqual(7)
  })
})
