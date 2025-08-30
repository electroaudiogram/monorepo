import { BasePayload } from 'payload'

export default async function (payload: BasePayload) {
  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existingUsers.docs.length > 0) {
    payload.logger.info('Users already exist, skipping seeding.')
    return
  }

  await payload.create({
    collection: 'users',
    data: {
      email: process.env.CMS_EMAIL!,
      password: process.env.CMS_PASSWORD!,
    },
  })

  payload.logger.info('Users successfully seeded!')
}
