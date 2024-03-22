import { sleep } from "../../utils";
import { AccountNftProcessor } from "./plugins/account";
import { TrekkerPlugin } from "./plugins/definition";
import { Monitor } from "./plugins/monitor";
import oracle, { account, asc } from '@kade-net/oracle'


export class AptosTrekker {
    monitor: Monitor
    accounts: TrekkerPlugin

    constructor(monitor: Monitor, accounts: TrekkerPlugin) {
        this.monitor = monitor
        this.accounts = accounts
    }

    static async init() {
        const monitor = await Monitor.init()
        const accounts = new AccountNftProcessor()
        return new AptosTrekker(monitor, accounts)
    }

    async start() {
        const last_offset = await this.monitor.getLastAccountReadOffset()

        const accounts = await oracle.query.account.findMany({
            columns: {
                address: true
            },
            offset: last_offset,
            limit: Monitor.OFFSET_BY,
            orderBy: asc(account.timestamp)
        })

        for (const account of accounts) {
            try {
                console.log("Processing account::", account.address)
                await this.accounts.process(account.address, this.monitor)
                await this.monitor.setLastAccountReadOffset(last_offset + (accounts.length ?? 0))
            }
            catch (e) {
                console.log("Error processing account::", e)
            }
        }


        await sleep(60_000) // 1 minute wait

        await this.start()
    }
}