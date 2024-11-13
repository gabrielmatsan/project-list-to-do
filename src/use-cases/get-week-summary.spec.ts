import { getUser } from './get-user'
import { makeUser } from '../../tests/factories/make-user'
import { makeGoal } from '../../tests/factories/make-goal'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'
import { getWeekPendingGoals } from './get-week-pending-goals'
import { getWeekSummary } from './get-week-summary'
import dayjs from 'dayjs'

// Exemplo de teste básico em qualquer arquivo .spec.ts ou .test.ts
describe('Get week pending goals', () => {
  it('should be able to get week pending goals', async () => {
    const user = await makeUser()
    const weekStartsAt = dayjs(new Date(2024, 10, 10))
      .startOf('week')
      .toDate()

    const goal1 = await makeGoal({
      userId: user.id,
      title: 'nadar',
      createdAt: weekStartsAt,
      desiredWeeklyFrequency: 2,
    })
    const goal2 = await makeGoal({
      userId: user.id,
      title: 'correr',
      createdAt: weekStartsAt,
      desiredWeeklyFrequency: 3,
    })
    const goal3 = await makeGoal({
      userId: user.id,
      title: 'pular',
      createdAt: weekStartsAt,
      desiredWeeklyFrequency: 1,
    })

    //pular
    await makeGoalCompletion({
      goalId: goal3.id,
      createdAt: dayjs(weekStartsAt).add(1, 'day').toDate(),
    })
    //correr
    await makeGoalCompletion({
      goalId: goal2.id,
      createdAt: dayjs(weekStartsAt).add(1, 'day').toDate(),
    })
    //correr
    await makeGoalCompletion({
      goalId: goal2.id,
      createdAt: dayjs(weekStartsAt).add(2, 'day').toDate(),
    })
    //nadar
    await makeGoalCompletion({
      goalId: goal1.id,
      createdAt: dayjs(weekStartsAt).add(3, 'day').toDate(),
    })

    const result = await getWeekSummary({ userId: user.id, weekStartsAt })

    console.log(result)
    expect(result).toEqual({
      summary: {
        completed: 4,
        total: 6,
        goalsPerDay: {
          '2024-11-11': expect.arrayContaining([
            expect.objectContaining({
              title: 'pular',
            }),
            expect.objectContaining({
              title: 'correr',
            }),
          ]),
          '2024-11-12': expect.arrayContaining([
            expect.objectContaining({
              title: 'correr',
            }),
          ]),
          '2024-11-13': expect.arrayContaining([
            expect.objectContaining({
              title: 'nadar',
            }),
          ]),
        },
      },
    })
  })
})
