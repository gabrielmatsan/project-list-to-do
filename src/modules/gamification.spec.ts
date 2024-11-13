import {
  calculateExperienceToLevel,
  calculateLevelFromExperience,
  calculateTotalExperienceToLevel,
} from './gamification'

test('experience to level', () => {
  const experienceToLevel1 = calculateExperienceToLevel(1)
  const experienceToLevel2 = calculateExperienceToLevel(2)
  const experienceToLevel5 = calculateExperienceToLevel(4)

  expect(experienceToLevel1).toEqual(0)
  expect(experienceToLevel2).toEqual(26)
  expect(experienceToLevel5).toEqual(43)
})

test('level from experience', () => {
  const level1 = calculateLevelFromExperience(10)
  const level2 = calculateLevelFromExperience(27)
  const level4 = calculateLevelFromExperience(43 + 33 + 26)

  expect(level1).toEqual(1)
  expect(level2).toEqual(2)
  expect(level4).toEqual(4)
})

test('total experience to level', () => {
  const experienceToLevel1 = calculateTotalExperienceToLevel(1)
  const experienceToLevel2 = calculateTotalExperienceToLevel(2)
  const experienceToLevel3 = calculateTotalExperienceToLevel(3)
  const experienceToLevel4 = calculateTotalExperienceToLevel(4)

  expect(experienceToLevel1).toEqual(0)
  expect(experienceToLevel2).toEqual(26)
  expect(experienceToLevel3).toEqual(26 + 33)
  expect(experienceToLevel4).toEqual(26 + 33 + 43)
})
