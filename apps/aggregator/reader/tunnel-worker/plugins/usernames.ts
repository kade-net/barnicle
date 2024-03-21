import { events } from "@kade-net/tunnel";
import { EVENT_NAMES } from "../../../types";
import PluginProcessor from "./definition";
import oracle, { username } from '@kade-net/oracle'
import { Lama } from "../../../lama";



export class RegisterUsernameEvent extends PluginProcessor {
    name(): EVENT_NAMES {
        return "RegisterUsernameEvent";
    }

    async process(data: events.Event, monitor: Lama): Promise<void> {
        const status = await PluginProcessor.checkStatus(data, monitor);
        const parsed = data.username_registration_event.toObject();

        if (status == "success") {
            console.log("Already processed", parsed);
            return;
        }


        try {
            await oracle.insert(username).values({
                owner_address: parsed.owner_address!,
                token_address: parsed.token_address!,
                username: parsed.username!,
                timestamp: new Date(parsed.timestamp!),
            });

            await PluginProcessor.markSuccess(data, monitor);
        }
        catch (e) {
            console.log("Error processing data::", e);

            await PluginProcessor.markFailed(data, monitor);
        }
    }
}