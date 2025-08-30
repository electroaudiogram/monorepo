import payload, { type SanitizedConfig } from 'payload'

import seedUsers from './users'

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })

  await seedUsers(payload)

  payload.logger.info('Successfully seeded!')
  process.exit(0)
}
