import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CreateGoal } from '../../use-cases/create-goal'
import { authenticateUser } from '../hooks/authenticate-user'

export const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      onRequest: [authenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Create a goal',
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
          userId: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { title, desiredWeeklyFrequency } = request.body

      await CreateGoal({
        title,
        desiredWeeklyFrequency,
        userId,
      })

      return reply.status(201).send()
    }
  )
}
