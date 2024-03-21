declare namespace NodeJS {
    interface ProcessEnv {
        TUNNEL_CONNECTION: string
        STARTING_SEQUENCE_NUMBER: string
        PG_CONNECTION_STRING: string
    }
}