import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummary } from '../../use-cases/get-week-summary'
import z from 'zod'
import { authenticateUser } from '../hooks/authenticate-user'
import dayjs from 'dayjs'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/week-summary',
    {
      onRequest: [authenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Get week summary',
        querystring: z.object({
          weekStartsAt: z.coerce
            .date()
            .optional()
            .default(dayjs().startOf('week').toDate()),
        }),
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
      const { weekStartsAt } = request.query
      //const weekStartsAt = request.query.weekStartsAt
      const { summary } = await getWeekSummary({
        userId,
        weekStartsAt,
      })

      return { summary }
    }
  )
}
