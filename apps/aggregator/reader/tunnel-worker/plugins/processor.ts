import { events } from "@kade-net/tunnel";
import PluginProcessor from "./definition";
import { EVENT_NAMES } from "../../../types";
import { Lama } from "../../../lama";



export class DataProcessor {

    monitor: Lama

    constructor(monitor: Lama) {
        this.monitor = monitor
    }

    static async init() {
        const monitor = await Lama.init("monitor")
        return new DataProcessor(monitor)
    }

    registeredPlugins: Array<PluginProcessor> = []

    registerPlugin(plugin: PluginProcessor) {
        this.registeredPlugins.push(plugin)
    }

    async process(data: events.Event) {
        const event_type = data?.event_type as EVENT_NAMES

        const plugin = this.registeredPlugins.find((plugin) => plugin.name() === event_type)

        if (plugin) {
            await plugin.process(data, this.monitor)
        }
        else {
            console.log("No plugin found for event type::", event_type)
        }
    }

}