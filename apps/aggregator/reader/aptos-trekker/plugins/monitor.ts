import { Lama } from "../../../lama";


export class Monitor {

    private last_read_kv: Lama
    private last_offset_kv: Lama
    private last_account_read_offset_kv: Lama



    static OFFSET_BY = 20;

    constructor(last_read_kv: Lama, last_offset_kv: Lama, last_account_read_offset_kv: Lama) {
        this.last_read_kv = last_read_kv
        this.last_offset_kv = last_offset_kv
        this.last_account_read_offset_kv = last_account_read_offset_kv
    }

    static async init() {
        const last_read_kv = await Lama.init("last_read")
        const last_offset_kv = await Lama.init("last_offset")
        const last_account_read_offset_kv = await Lama.init("last_account_read_offset")

        return new Monitor(last_read_kv, last_offset_kv, last_account_read_offset_kv)
    }

    async setLastRead(address: string) {
        await this.last_read_kv.put(address, Date.now().toString())
    }

    async getLastRead(address: string) {
        const value = await this.last_read_kv.get(address)

        if (value) {
            return parseInt(value)
        } else {
            return null
        }
    }

    async setLastOffset(address: string, offset: number) {
        await this.last_offset_kv.put(address, offset.toString())
    }

    async getLastOffset(address: string) {
        const value = await this.last_offset_kv.get(address)

        if (value) {
            return parseInt(value)
        } else {
            return 0
        }
    }

    async setLastAccountReadOffset(offset: number) {
        await this.last_account_read_offset_kv.put("last_offset", offset.toString())
    }

    async getLastAccountReadOffset() {
        const value = await this.last_account_read_offset_kv.get("last_offset")

        if (value) {
            return parseInt(value)
        } else {
            return 0
        }
    }
}