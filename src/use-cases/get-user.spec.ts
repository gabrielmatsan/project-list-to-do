import { getUser } from './get-user'
import { makeUser } from '../../tests/factories/make-user'

// Exemplo de teste básico em qualquer arquivo .spec.ts ou .test.ts
describe('Get user', () => {
  it('should be able to get user', async () => {
    const user = await makeUser()

    const result = await getUser({ userId: user.id })

    expect(result).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    })
  })
})
