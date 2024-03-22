import { ACCOUNT } from "@kade-net/oracle";
import { Monitor } from "./monitor";


export abstract class TrekkerPlugin {

    abstract process(address: string, monitor: Monitor): Promise<void>

}