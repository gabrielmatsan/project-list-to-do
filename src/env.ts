import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
