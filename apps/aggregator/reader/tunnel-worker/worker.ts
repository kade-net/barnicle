import { events, ServiceError } from "@kade-net/tunnel";
import client from "../client";
import { EVENT_NAMES } from "../../types";
import { Lama } from "../../lama";
import processor from "./plugins";
import { sleep } from "../../utils";


const sequenceStore = await Lama.init("sequence")

class TunnelWorker {
    constructor() {}

    async start(starting_sequence: number | undefined = 0) {

        const last_read_sequence = await sequenceStore.get("last_read_sequence")

        if (last_read_sequence) {
            const last_read_sequence_int = parseInt(last_read_sequence)
            if (!Number.isNaN(last_read_sequence_int) && last_read_sequence_int > starting_sequence) {
                starting_sequence = last_read_sequence_int
            }
        }

        const request = new events.EventRequest({
            sequence_number: starting_sequence
        })

        const requestPromise = new Promise<events.Event | undefined>((res, rej) => {
            client.GetTunnelEvent(request, (error, data) => {
                if (error) {
                    rej(error)
                } else {
                    res(data)
                }
            })
        })

        try {
            const data = await requestPromise
            if (data) {
                await processor.process(data)
            }
            else {
                console.log("No data")
            }
        }
        catch (e) {
            const error = e as ServiceError

            if (error?.message?.includes('No data found')) {
                console.log("No data found")
                await sleep(180_000) // 3 minute wait
                this.start(starting_sequence)

                return
            }

            if (error?.message?.includes('No plugin found for event ')) {
                console.log("No plugin found for event")

            }

            // console.log("Error processing data::", e)
        }

        const next_sequence = starting_sequence + 1
        await sequenceStore.put("last_read_sequence", starting_sequence.toString())
        this.start(next_sequence)

    }
}

const tunnelWorker = new TunnelWorker()

export default tunnelWorker