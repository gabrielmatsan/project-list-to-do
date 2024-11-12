import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CreateGoalsCompletions } from '../../use-cases/create-goal-completions'
import { authenticateUser } from '../hooks/authenticate-user'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      onRequest: [authenticateUser],
      schema: {
        tags: ['goals'],
        description: 'Complete a goal',
        body: z.object({
          goalId: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { goalId } = request.body

      const userId = request.user.sub

      await CreateGoalsCompletions({
        userId,
        goalId,
      })

      return reply.status(201).send()
    }
  )
}
