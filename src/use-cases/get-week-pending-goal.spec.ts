import { getUser } from './get-user'
import { makeUser } from '../../tests/factories/make-user'
import { makeGoal } from '../../tests/factories/make-goal'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'
import { getWeekPendingGoals } from './get-week-pending-goals'

// Exemplo de teste básico em qualquer arquivo .spec.ts ou .test.ts
describe('Get week pending goals', () => {
  it('should be able to get week pending goals', async () => {
    const user = await makeUser()

    const goal1 = await makeGoal({
      userId: user.id,
      title: 'nadar',
      desiredWeeklyFrequency: 2,
    })
    const goal2 = await makeGoal({
      userId: user.id,
      title: 'correr',
      desiredWeeklyFrequency: 3,
    })
    const goal3 = await makeGoal({
      userId: user.id,
      title: 'pular',
      desiredWeeklyFrequency: 1,
    })

    await makeGoalCompletion({ goalId: goal3.id })
    await makeGoalCompletion({ goalId: goal2.id })
    await makeGoalCompletion({ goalId: goal2.id })
    await makeGoalCompletion({ goalId: goal1.id })

    const result = await getWeekPendingGoals({ userId: user.id })

    expect(result).toEqual({
      pendingGoals: expect.arrayContaining([
        expect.objectContaining({
          title: 'nadar',
          desiredWeeklyFrequency: 2,
          completionCount: 1,
        }),
        expect.objectContaining({
          title: 'correr',
          desiredWeeklyFrequency: 3,
          completionCount: 2,
        }),
        expect.objectContaining({
          title: 'pular',
          desiredWeeklyFrequency: 1,
          completionCount: 1,
        }),
      ]),
    })
  })
})
