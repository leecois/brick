/* eslint-disable no-restricted-properties */
import { createEnv } from '@t3-oss/env-nextjs'
import { vercel } from '@t3-oss/env-nextjs/presets'
import { z } from 'zod'

import { env as authEnv } from '@a/auth/env'

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV

    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  extends: [authEnv, vercel()],
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    ENDPOINT: z.string().url(),
    TURSO_TOKEN: z.string(),
    TURSO_URL: z.string().url()
  },
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
  },
  skipValidation: Boolean(process.env.CI) || process.env.npm_lifecycle_event === 'lint'
})
