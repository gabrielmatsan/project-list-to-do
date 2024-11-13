import { users } from '@/db/schema'
import { makeGoal } from '../../tests/factories/make-goal'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'
import { makeUser } from '../../tests/factories/make-user'
import { AuthenticateFromGithubCode } from './authenticate-from-github-code'
import { CreateGoalsCompletions } from './create-goal-completions'
import * as githubOAuth from '../modules/github-oauth'
import { db } from '@/db'
import { and, eq, ne } from 'drizzle-orm'
import { faker } from '@faker-js/faker'

describe('Authenticate from Github Code', () => {
  beforeEach(() => {
    vi.mock('../modules/github-oauth')

    vi.clearAllMocks()
  })
  it('should be able to authenticate from github code', async () => {
    vi.spyOn(githubOAuth, 'getUserFromAccessToken').mockResolvedValueOnce({
      id: 123456789,
      name: 'John Doe',
      email: null,
      avatar_url: 'https://example.com/avatar.png',
    })

    const sut = await AuthenticateFromGithubCode({
      code: 'any_code',
    })

    expect(sut.token).toEqual(expect.any(String))

    const [userOnDatabase] = await db
      .select()
      .from(users)
      .where(eq(users.externalAccountId, 123456789))

    expect(userOnDatabase.name).toEqual('John Doe')
  })
  it('should be able to authenticate with existing github user', async () => {
    const existing = await makeUser({
      name: 'Jane Doe',
    })

    await db
      .delete(users)
      .where(
        and(
          eq(users.externalAccountId, existing.externalAccountId),
          ne(users.id, existing.id)
        )
      )

    vi.spyOn(githubOAuth, 'getUserFromAccessToken').mockResolvedValueOnce({
      id: existing.externalAccountId,
      // nome diferente proposital para testar se irá atualizar, o que não deve acontecer
      name: 'John Doe',
      email: null,
      avatar_url: 'https://example.com/avatar.png',
    })

    const sut = await AuthenticateFromGithubCode({
      code: 'any_code',
    })

    expect(sut.token).toEqual(expect.any(String))

    const [userOnDatabase] = await db
      .select()
      .from(users)
      .where(eq(users.externalAccountId, existing.externalAccountId))

    expect(userOnDatabase.name).toEqual('Jane Doe')
  })
})
