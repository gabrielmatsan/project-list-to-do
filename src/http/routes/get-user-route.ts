import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CreateGoalsCompletions } from '../../use-cases/create-goal-completions'
import { AuthenticateFromGithubCode } from '../../use-cases/authenticate-from-github-code'
import { getUser } from '../../use-cases/get-user'

export const getProfileRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        description: 'Get authenticated user profile',
        response: {
          200: z.object({
            profile: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string().nullable(),
              avatarUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const { user } = await getUser({
        userId,
      })

      return reply.status(201).send({ profile: user })
    }
  )
}
