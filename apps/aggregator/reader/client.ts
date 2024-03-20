import 'dotenv/config'
import { TunnelServiceClient, credentials } from '@kade-net/tunnel'

const client = new TunnelServiceClient(process.env.TUNNEL_CONNECTION!, credentials.createInsecure())

export default client