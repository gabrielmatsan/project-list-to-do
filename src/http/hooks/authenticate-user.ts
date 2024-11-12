import type { FastifyRequest, FastifyReply } from 'fastify'
export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ message: 'Unauthorized' })
  }
}
