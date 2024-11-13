import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUser } from '../../use-cases/get-user'
import { authenticateUser } from '../hooks/authenticate-user'
import { getUserLevelAndExperience } from '@/use-cases/get-user-level-and-experience'

export const getUserAndLevelExperienceRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/profile-gamification',
      {
        schema: {
          onRequest: [authenticateUser],
          tags: ['Gamification'],
          description: 'Get user and level experience',
          response: {
            200: z.object({
              experience: z.number(),
              level: z.number(),
              experienceToNextLevel: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = request.user.sub

        const { experience, level, experienceToNextLevel } =
          await getUserLevelAndExperience({
            userId,
          })

        return reply
          .status(200)
          .send({ experience, level, experienceToNextLevel })
      }
    )
  }
