import { drizzle, PostgresJsDatabase } from '@kade-net/oracle/postgres-js';
import postgres from '@kade-net/oracle/postgres'
import * as schema from './schema'



const queryClient = postgres(process.env.PG_CONNECTION_STRING!);

const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
    schema
})

export default db;
