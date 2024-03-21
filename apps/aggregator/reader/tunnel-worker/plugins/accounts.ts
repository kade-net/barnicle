import { events } from "@kade-net/tunnel"
import { EVENT_NAMES } from "../../../types"
import PluginProcessor from "./definition"
import oracle, { account, and, eq, follow, profile } from '@kade-net/oracle'
import { Lama } from "../../../lama"


export class AccountCreateEvent extends PluginProcessor {
    name(): EVENT_NAMES {
        return "AccountCreateEvent"
    }

    async process(data: events.Event, monitor: Lama): Promise<void> {
        const status = await PluginProcessor.checkStatus(data, monitor)
        const parsed = data.account_create_event.toObject()
        if (status == "success") {
            console.log("Already processed", parsed)
            return
        }

        try {
            await oracle.insert(account).values({
                address: parsed.creator_address!,
                id: parsed.kid!,
                object_address: parsed.account_object_address!,
                timestamp: new Date(parsed.timestamp!),
            })
            await PluginProcessor.markSuccess(data, monitor)
        }
        catch (e) {
            console.log("Error processing data::", e)
            await PluginProcessor.markFailed(data, monitor)
        }
    }
}

export class AccountFollowEvent extends PluginProcessor {
    name(): EVENT_NAMES {
        return "AccountFollowEvent"
    }

    async process(data: events.Event, monitor: Lama): Promise<void> {

        const status = await PluginProcessor.checkStatus(data, monitor)
        const parsed = data.account_follow_event.toObject()

        if (status == "success") {
            console.log("Already processed", parsed)
            return
        }


        try {
            await oracle.insert(follow).values({
                follower_id: parsed.follower_kid!,
                following_id: parsed.following_kid!,
                id: parsed.kid!,
                timestamp: new Date(parsed.timestamp!),
            })

            await PluginProcessor.markSuccess(data, monitor)
        }
        catch (e) {
            console.log("Error processing data::", e)
            await PluginProcessor.markFailed(data, monitor)
        }
    }
}

export class AccountUnFollowEvent extends PluginProcessor {
    name(): EVENT_NAMES {
        return "AccountUnFollowEvent"
    }

    async process(data: events.Event, monitor: Lama): Promise<void> {
        const parsed = data.account_unfollow_event.toObject()

        const status = await PluginProcessor.checkStatus(data, monitor)

        if (status == "success") {
            console.log("Already processed", parsed)
            return
        }

        try {
            await oracle.delete(follow).where(
                and(
                    eq(follow.follower_id, parsed.user_kid!),
                    eq(follow.following_id, parsed.unfollowing_kid!),
                )
            )

            await PluginProcessor.markSuccess(data, monitor)
        }
        catch (e) {
            console.log("Error processing data::", e)

            await PluginProcessor.markFailed(data, monitor)
        }
    }
}

export class ProfileUpdateEvent extends PluginProcessor {
    name(): EVENT_NAMES {
        return "ProfileUpdateEvent"
    }

    async process(data: events.Event, monitor: Lama): Promise<void> {
        const parsed = data.profile_update_event.toObject()

        const status = await PluginProcessor.checkStatus(data, monitor)

        if (status == "success") {
            console.log("Already processed", parsed)
            return
        }

        try {


            const existing_profile = await oracle.query.profile.findFirst({
                where: (fields, { eq }) => eq(fields.creator, parsed.user_kid!)
            })

            if (existing_profile) {
                await oracle.update(profile).set({
                    bio: parsed.bio!,
                    display_name: parsed.display_name!,
                    pfp: parsed.pfp!,
                })
                    .where(
                        eq(profile.creator, parsed.user_kid!)
                    )
            }
            else {
                await oracle.insert(profile).values({
                    creator: parsed.user_kid!,
                    bio: parsed.bio!,
                    display_name: parsed.display_name!,
                    pfp: parsed.pfp!,
                })
            }

            await PluginProcessor.markSuccess(data, monitor)

        }
        catch (e) {
            console.log("Error processing data::", e)

            await PluginProcessor.markFailed(data, monitor)
        }
    }
}