import type { InferSelectModel } from 'drizzle-orm'
import { relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import type { Address, Product, SocialMedia } from '@a/nextjs/src/types'

const User = sqliteTable('user', {
    addresses: text('addresses', { mode: 'json' }).$type<Address[]>().default([]),
    company: text('company').default(''),
    description: text('description').default(''),
    email: text('email').notNull(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    image: text('image'),
    industries: text('industries', { mode: 'json' }).$type<string[]>().default([]),
    job: text('job').default(''),
    mails: text('mails', { mode: 'json' }).$type<string[]>().default([]),
    name: text('name'),
    phones: text('phones', { mode: 'json' }).$type<string[]>().default([]),
    products: text('products', { mode: 'json' }).$type<Product[]>().default([]),
    socials: text('socials', { mode: 'json' }).$type<SocialMedia[]>().default([]),
    targets: text('targets', { mode: 'json' }).$type<string[]>().default([]),
    websites: text('websites', { mode: 'json' }).$type<string[]>().default([])
  }),
  UpdateUserSchema = z.object({
    _: z.array(z.object({ _: z.string() })).optional(),
    addresses: z
      .array(z.object({ country: z.string().min(1), name: z.string().min(1) }))
      .optional(),
    company: z.string().optional(),
    description: z.string().optional(),
    id: z.string(),
    industries: z.array(z.string().min(1)).optional(),
    job: z.string().optional(),
    mails: z.array(z.string().email()).optional(),
    name: z.string().optional(),
    phones: z.array(z.string().min(1)).optional(),
    products: z.array(z.object({ description: z.string(), name: z.string().min(1) })).optional(),
    socials: z.array(z.object({ platform: z.string().min(1), url: z.string().url() })).optional(),
    targets: z.array(z.string().min(1)).optional(),
    websites: z.array(z.string().url()).optional()
  }),
  Collection = sqliteTable('collection', {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    items: text('items', { mode: 'json' }).$type<string[]>().notNull().default([]),
    name: text('name').notNull(),
    update: integer('update', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdateFn(() => new Date())
      .$type<Date>(),
    user: text('user')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' })
  }),
  CreateCollectionSchema = createInsertSchema(Collection, {
    name: z.string(),
    user: z.string()
  }).omit({
    id: true,
    items: true,
    update: true
  }),
  UpdateCollectionSchema = z.object({
    id: z.string(),
    items: z.array(z.string().min(1)).optional(),
    name: z.string().optional()
  }),
  History = sqliteTable('history', {
    date: integer('date', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    id: text('id').primaryKey(),
    query: text('query').notNull(),
    source: text('source').notNull(),
    user: text('user')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' })
  }),
  CreateHistorySchema = createInsertSchema(History, {
    id: z.string(),
    query: z.string(),
    source: z.string(),
    user: z.string()
  }).omit({ date: true }),
  Account = sqliteTable(
    'account',
    {
      access_token: text('access_token'),
      expires_at: integer('expires_at'),
      id_token: text('id_token'),
      provider: text('provider').notNull(),
      providerAccountId: text('providerAccountId').notNull(),
      refresh_token: text('refresh_token'),
      scope: text('scope'),
      session_state: text('session_state'),
      token_type: text('token_type'),
      type: text('type').$type<'email' | 'oauth' | 'oidc' | 'webauthn'>().notNull(),
      userId: text('userId')
        .notNull()
        .references(() => User.id, { onDelete: 'cascade' })
    },
    account => ({
      compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
    })
  ),
  UserRelations = relations(User, ({ many }) => ({ accounts: many(Account) })),
  AccountRelations = relations(Account, ({ one }) => ({
    user: one(User, { fields: [Account.userId], references: [User.id] })
  })),
  Session = sqliteTable('session', {
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' })
  }),
  SessionRelations = relations(Session, ({ one }) => ({
    user: one(User, { fields: [Session.userId], references: [User.id] })
  }))

type CollectionModel = InferSelectModel<typeof Collection>
type UserGeneratable = Omit<UserUpdatable, '_' | 'ava' | 'id' | 'job' | 'name'>
type UserUpdatable = z.infer<typeof UpdateUserSchema>
type UserModel = InferSelectModel<typeof User>

export type { CollectionModel, UserGeneratable, UserModel, UserUpdatable }

export {
  Account,
  AccountRelations,
  Collection,
  CreateCollectionSchema,
  CreateHistorySchema,
  History,
  Session,
  SessionRelations,
  UpdateCollectionSchema,
  UpdateUserSchema,
  User,
  UserRelations
}
