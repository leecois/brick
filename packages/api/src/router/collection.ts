import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import { desc, eq, inArray } from '@a/db'
import { Collection, CreateCollectionSchema, UpdateCollectionSchema } from '@a/db/schema'

import { protectedProcedure } from '../trpc'

export const collectionRouter = {
  all: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => ctx.db.select().from(Collection).where(eq(Collection.user, input))),

  byId: protectedProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.db
      .select()
      .from(Collection)
      .where(eq(Collection.id, input))
      .limit(1)
      .then(value => value[0] ?? null)
  ),

  create: protectedProcedure
    .input(CreateCollectionSchema)
    .mutation(({ ctx, input }) => ctx.db.insert(Collection).values(input)),

  delete: protectedProcedure
    .input(z.array(z.string()))
    .mutation(({ ctx, input }) => ctx.db.delete(Collection).where(inArray(Collection.id, input))),
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
          .from(Collection)
          .where(eq(Collection.user, input.user))
          .orderBy(desc(Collection.update))
          .offset(cursor)
          .limit(limit)
      return {
        items,
        next: items.length === limit ? cursor + limit : null
      }
    }),

  update: protectedProcedure.input(UpdateCollectionSchema).mutation(({ ctx, input }) =>
    ctx.db
      .update(Collection)
      .set(input)
      .where(eq(Collection.id, input.id))
      .returning()
      .then(value => value[0] ?? null)
  )
} satisfies TRPCRouterRecord
