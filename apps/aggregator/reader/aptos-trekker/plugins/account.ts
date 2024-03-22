import { eq } from "drizzle-orm";
import aptos from "../../../aptos";
import db from "../../../db";
import { collection, nft as nftTable } from "../../../db/schema";
import { TrekkerPlugin } from "./definition";
import { Monitor } from "./monitor";
import dayjs from "dayjs";


export class AccountNftProcessor extends TrekkerPlugin {

    async process(address: string, monitor: Monitor) {

        const lastRead = await monitor.getLastRead(address) ?? 0
        const lastOffset = await monitor.getLastOffset(address)
        console.log(`ADDRESS::${address}::LAST_READ::${lastRead}::LAST_OFFSET::${lastOffset}`)

        const diff = dayjs().diff(dayjs(lastRead), "minute")

        if (diff < 30) { // 30 minutes
            return
        }



        const currentTokens = await aptos.getAccountOwnedTokens({
            accountAddress: address,
            options: {
                limit: 20,
                offset: lastOffset
            }
        })

        for (const token of currentTokens) {
            const nft_address = token.token_data_id
            const collection_address = token.current_token_data?.collection_id

            // check if the nft is already in the database
            try {
                await db.transaction(async (txn) => {
                    const nft = await txn.query.nft.findFirst({
                        where: (fields, { eq, and }) => and(
                            eq(fields.address, nft_address),
                            collection_address ? eq(fields.collection, collection_address) : undefined
                        )
                    })

                    if (nft) {
                        if (nft.collector !== address) {
                            await txn.update(nftTable).set({
                                collector: address
                            }).where(eq(nftTable.address, nft_address))
                        }
                        return
                    }

                    const _collection = collection_address ? await txn.query.collection.findFirst({
                        where: (fields, { eq }) => eq(fields.address, collection_address)
                    }) : null

                    const collection_data = token.current_token_data?.current_collection

                    if (!_collection) {
                        await txn.insert(collection).values({
                            address: collection_address!,
                            name: token.current_token_data?.current_collection?.collection_name!,
                            description: collection_data?.description!,
                            uri: collection_data?.uri!,
                            creator: collection_data?.creator_address!,
                            max_supply: collection_data?.max_supply ?? 0,
                            supply: collection_data?.current_supply!
                        })

                    }

                    if (!nft) {
                        await txn.insert(nftTable).values({
                            address: nft_address!,
                            collection: collection_address!,
                            collector: address,
                            description: token.current_token_data?.description ?? "",
                            name: token.current_token_data?.token_name ?? "",
                            uri: token.current_token_data?.token_uri ?? ""
                        })
                    }


                })
            }
            catch (e) {
                console.log("UNable to process nft::", token.token_data_id, " Encountered error::", e)
            }


        }

        await monitor.setLastRead(address)
        await monitor.setLastOffset(address, lastOffset + (currentTokens?.length ?? 0))
    }

}