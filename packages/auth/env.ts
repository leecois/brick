/* eslint-disable no-restricted-properties */
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {},
  experimental__runtimeEnv: {},
  server: {
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    AUTH_SECRET:
      process.env.NODE_ENV === 'production' ? z.string().min(1) : z.string().min(1).optional(),
    NODE_ENV: z.enum(['development', 'production']).optional()
  },
  skipValidation: Boolean(process.env.CI) || process.env.npm_lifecycle_event === 'lint'
})
