import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../../use-cases/get-week-pending-goals'
import z from 'zod'
import { authenticateUser } from '../hooks/authenticate-user'

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      onRequest: [authenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Get pending goals',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              desiredWeeklyFrequency: z.number().int().min(1).max(7),
            })
          ),
        },
      },
    },
    async request => {
      const userId = request.user.sub
      const { pendingGoals } = await getWeekPendingGoals({
        userId,
      })

      return pendingGoals
    }
  )
}
