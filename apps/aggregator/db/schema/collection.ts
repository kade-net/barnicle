
import { account, relations } from '@kade-net/oracle'
import { pgTable, text } from '@kade-net/oracle/pg-core'


export const collection = pgTable('collection', {
    address: text("address").notNull().primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    uri: text("uri").notNull(),
    creator: text("creator").notNull(),
    supply: text("supply").notNull(),
    max_supply: text("max_supply").notNull(),
})

export const collection_relations = relations(collection, ({ many }) => {
    return {
        nfts: many(nft, {
            relationName: "nfts",
        })
    }
})

export const nft = pgTable('nft', {
    address: text("address").notNull().primaryKey(),
    collection: text("collection").notNull().references(() => collection.address),
    collector: text("collector").notNull(),
    uri: text("uri").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
})


export const nft_relations = relations(nft, ({ one }) => {
    return {
        collection: one(collection, {
            fields: [nft.collection],
            references: [collection.address],
            relationName: "collection",
        }),
        collector: one(account as any, {
            fields: [nft.collector],
            references: [account.address],
            relationName: "collector",
        })
    }
})


