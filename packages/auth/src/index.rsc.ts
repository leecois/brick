import { cache } from 'react'
import NextAuth from 'next-auth'

import { authConfig } from './config'

export type { Session } from 'next-auth'

const { auth: defaultAuth, handlers, signIn, signOut } = NextAuth(authConfig),
  /**
   * This is the main way to get session data for your RSCs.
   * This will de-duplicate all calls to next-auth's default `auth()` function and only call it once per request
   */
  auth = cache(defaultAuth)

export { auth, handlers, signIn, signOut }

export { invalidateSessionToken, isSecureContext, validateToken } from './config'
