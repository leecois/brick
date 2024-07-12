import { authRouter } from './router/auth'
import { collectionRouter } from './router/collection'
import { historyRouter } from './router/history'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  collection: collectionRouter,
  history: historyRouter,
  user: userRouter
})

// Export type definition of API
export type AppRouter = typeof appRouter
