import { client, db } from '.'
import { goals, goalsCompletions, users } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalsCompletions)
  await db.delete(goals)
  await db.delete(users)

  const [user] = await db
    .insert(users)
    .values({
      name: 'John Doe',
      externalAccountId: 1213,
      avatarUrl: 'https://github.com/gabrielmatsan.png',
    })
    .returning()

  const result = await db
    .insert(goals)
    .values([
      { userId: user.id, title: 'Learn to code', desiredWeeklyFrequency: 3 },
      { userId: user.id, title: 'Exercise', desiredWeeklyFrequency: 5 },
      { userId: user.id, title: 'Read a book', desiredWeeklyFrequency: 2 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalsCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
