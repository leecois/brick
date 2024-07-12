import { cache } from 'react'
import { headers } from 'next/headers'
import { createHydrationHelpers } from '@trpc/react-query/rsc'

import type { AppRouter } from '@a/api'
import { createCaller, createTRPCContext } from '@a/api'
import { auth } from '@a/auth'

import { createQueryClient } from './query-client'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
    const heads = new Headers(headers())
    heads.set('x-trpc-source', 'rsc')

    return createTRPCContext({
      headers: heads,
      session: await auth()
    })
  }),
  getQueryClient = cache(createQueryClient),
  caller = createCaller(createContext)

export const { HydrateClient, trpc: api } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
)
