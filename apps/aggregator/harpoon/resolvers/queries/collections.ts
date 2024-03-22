import { ACCOUNT, account, asc, count, desc, eq } from "@kade-net/oracle"
import { Context, PaginationArg, Resolver, SORT_ORDER } from "../../../types"
import { nft } from "../../../db/schema"



interface ResolverMap {
    Query: {
        collection: Resolver<any, { address: string }, Context, {
            supply: number,
            name: string,
            description: string,
            uri: string,
            kade_collectors_count: number,
        }>,
        collectors: Resolver<any, PaginationArg & { collection_address: string, sort: SORT_ORDER }, Context, ACCOUNT>
    },
    Account: {
        username: Resolver<ACCOUNT, {}, Context, string>,
        profile: Resolver<ACCOUNT, {}, Context, string>,
    }
}

export const resolvers: ResolverMap = {
    Query: {
        collection: async (_, { address }, { db }) => {
            if (!address || address.length === 0) throw new Error("Invalid address")

            const collection = await db.query.collection.findFirst({
                where: (fields, { eq }) => eq(fields.address, address),
            })

            if (!collection) throw new Error("Collection not found")

            const collectors = await db.selectDistinct({
                collectors: count(nft.collector)
            }).from(nft)
                .where(eq(nft.collection, address))

            const total = collectors?.at(0)?.collectors ?? 0

            return {
                supply: collection.supply,
                name: collection.name,
                description: collection.description,
                uri: collection.uri,
                kade_collectors_count: total
            }
        },
        collectors: async (_, { collection_address, pagination, sort }, context) => {
            const { db } = context
            const limit = pagination?.size ?? 10
            const offset = pagination?.page ? (pagination.page) * limit : 0

            const order = sort === "ASC" ? asc(nft.address) : desc(nft.address)

            const collectors = await db.query.nft.findMany({
                where: (fields, { eq }) => eq(fields.collection, collection_address),
                with: {
                    collector: true
                },
                orderBy: order,
                limit,
                offset
            })

            const data = collectors?.map((c) => c.collector) ?? []

            return data
        }
    },
    Account: {
        username: async (parent, _, { db }) => {
            const username = db.query.username.findFirst({
                where: (fields, { eq }) => eq(fields.owner_address, parent.address)
            })

            return username ?? null
        },
        profile: async (parent, _, { db }) => {
            const profile = db.query.profile.findFirst({
                where: (fields, { eq }) => eq(fields.creator, parent.id)
            })

            return profile ?? null
        }
    }
}