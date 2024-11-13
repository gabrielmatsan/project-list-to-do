import { makeUser } from '../../tests/factories/make-user'
import { CreateGoal } from './create-goal'

describe('Create a goal', () => {
  it('should be able to create a goal', async () => {
    const user = await makeUser()

    const result = await CreateGoal({
      userId: user.id,
      title: 'teste-title',
      desiredWeeklyFrequency: 1,
    })

    expect(result).toEqual({
      goal: expect.objectContaining({
        title: 'teste-title',
        desiredWeeklyFrequency: 1,
        userId: user.id,
      }),
    })
  })
})
