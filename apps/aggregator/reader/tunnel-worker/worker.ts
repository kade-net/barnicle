import { events } from "@kade-net/tunnel";
import client from "../client";



class TunnelWorker {
    constructor() {}

    async start(){

        const request = new events.EventsRequest({
            sequence_number: 0,
            event_type: ""
        })

        const stream = client.GetTunnelEvents(request)

        stream.on("data", (response: events.Event)=>{
            console.log("Data received::", response.toObject())
        })

        stream.on("end", ()=>{
            console.log("Stream ended")
        })

        stream.on("error", ()=>{
            console.log("Stream error")
        })

    }
}

const tunnelWorker = new TunnelWorker()

export default tunnelWorker