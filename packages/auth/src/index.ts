import NextAuth from 'next-auth'

import { authConfig } from './config'

export type { Session } from 'next-auth'

const { auth, handlers, signIn, signOut } = NextAuth(authConfig)

export { auth, handlers, signIn, signOut }

export { invalidateSessionToken, isSecureContext, validateToken } from './config'