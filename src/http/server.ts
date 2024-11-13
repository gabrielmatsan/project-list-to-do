import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal'
import { getPendingGoalsRoute } from './routes/get-pending-goals'
import { createCompletionRoute } from './routes/create-completion'
import { getWeekSummaryRoute } from './routes/get-week-summary-route'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { authenticateFromGithubRoute } from './routes/authenticate-from-github-route'
import fastifyJwt from '@fastify/jwt'
import { env } from '../env'
import { getProfileRoute } from './routes/get-user-route'
import { getUserAndLevelExperienceRoute } from './routes/get-user-and-level-experience-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Goals API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createGoalRoute)
app.register(getPendingGoalsRoute)
app.register(createCompletionRoute)
app.register(getWeekSummaryRoute)
app.register(authenticateFromGithubRoute)
app.register(getProfileRoute)
app.register(getUserAndLevelExperienceRoute)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
// https://www.github.com/login/oauth/authorize?client_id=Ov23liDaIIwA9HZ1DbyZ&redirect_uri=http://localhost:3000/auth/github/callback
