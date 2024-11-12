import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummary } from '../../use-cases/get-week-summary'
import z from 'zod'
import { authenticateUser } from '../hooks/authenticate-user'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/week-summary',
    {
      onRequest: [authenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Get week summary',
        response: {
          200: z.object({
            summary: z.object({
              completed: z.number().int(),
              total: z.number().int(),
              goalsPerDay: z.record(
                z.string(),
                z.array(
                  z.object({
                    id: z.string(),
                    title: z.string(),
                    completedAt: z.string(),
                  })
                )
              ),
            }),
          }),
        },
      },
    },
    async request => {
      const userId = request.user.sub
      const { summary } = await getWeekSummary({
        userId,
      })

      return { summary }
    }
  )
}
