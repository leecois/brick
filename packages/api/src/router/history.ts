import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import { desc, eq, inArray } from '@a/db'
import { CreateHistorySchema, History } from '@a/db/schema'

import { protectedProcedure } from '../trpc'

export const historyRouter = {
  create: protectedProcedure
    .input(CreateHistorySchema)
    .mutation(({ ctx, input }) => ctx.db.insert(History).values(input)),

  delete: protectedProcedure
    .input(z.array(z.string()))
    .mutation(({ ctx, input }) => ctx.db.delete(History).where(inArray(History.id, input))),
  infinite: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().min(1),
        user: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const cursor = input.cursor ?? 0,
        { limit } = input,
        items = await ctx.db
          .select()
          .from(History)
          .where(eq(History.user, input.user))
          .orderBy(desc(History.date))
          .offset(cursor)
          .limit(limit)
      return {
        items,
        next: items.length === limit ? cursor + limit : null
      }
    })
} satisfies TRPCRouterRecord
