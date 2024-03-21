import { events } from "@kade-net/tunnel";
import { EVENT_NAMES, EVENT_STATUS } from "../../../types";
import { Lama } from "../../../lama";
import { getSequenceNumber } from "../../../utils";


abstract class PluginProcessor {
    abstract name(): EVENT_NAMES

    abstract process(data: events.Event, monitor: Lama): Promise<void>

    static async checkStatus(data: events.Event, monitor: Lama): Promise<EVENT_STATUS> {
        const sequence_int = data.sequence_number ?? 0
        const sequence = getSequenceNumber(sequence_int)
        const status = await monitor.get(sequence)

        return status as EVENT_STATUS
    }

    static async mark(data: events.Event, monitor: Lama, status: EVENT_STATUS) {
        const sequence_int = data.sequence_number ?? 0
        const sequence = getSequenceNumber(sequence_int)

        await monitor.put(sequence, status)
    }
    static async markSuccess(data: events.Event, monitor: Lama) {
        await this.mark(data, monitor, 'success')
    }

    static async markFailed(data: events.Event, monitor: Lama) {
        await this.mark(data, monitor, 'failed')
    }
}

export default PluginProcessor