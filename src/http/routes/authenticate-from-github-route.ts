import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CreateGoalsCompletions } from '../../use-cases/create-goal-completions'
import { AuthenticateFromGithubCode } from '../../use-cases/authenticate-from-github-code'

export const authenticateFromGithubRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/auth/github',
    {
      schema: {
        tags: ['auth'],
        description: 'Authenticates a user from GitHub',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({ token: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const { token } = await AuthenticateFromGithubCode({
        code,
      })

      return reply.status(201).send({ token })
    }
  )
}
