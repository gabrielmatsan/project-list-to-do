import {
  calculateLevelFromExperience,
  calculateTotalExperienceToLevel,
} from '@/modules/gamification'
import { makeUser } from '../../tests/factories/make-user'
import { getUserLevelAndExperience } from './get-user-level-and-experience'

// Exemplo de teste básico em qualquer arquivo .spec.ts ou .test.ts
describe('Get user level and experience', () => {
  it('should be able to get user', async () => {
    const user = await makeUser({
      experience: 200,
    })

    const sut = await getUserLevelAndExperience({ userId: user.id })
    console.log(sut)

    const level = calculateLevelFromExperience(200)
    expect(sut).toEqual({
      experience: 200,
      level,
      experienceToNextLevel: calculateTotalExperienceToLevel(level),
    })
  })
})
