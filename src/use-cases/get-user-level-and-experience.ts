import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { db } from '../db'
import {
  calculateLevelFromExperience,
  calculateTotalExperienceToLevel,
} from '@/modules/gamification'

interface getUserLevelAndExperienceRequest {
  userId: string
}

export async function getUserLevelAndExperience({
  userId,
}: getUserLevelAndExperienceRequest) {
  const [{ experience }] = await db
    .select({
      experience: users.experience,
    })
    .from(users)
    .where(eq(users.id, userId))

  const level = calculateLevelFromExperience(experience)
  const experienceToNextLevel = calculateTotalExperienceToLevel(level)

  return { experience, level, experienceToNextLevel }
}
