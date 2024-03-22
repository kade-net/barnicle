import db from "./db";


export type EVENT_NAMES = 'RegisterUsernameEvent' |
    'AccountCreateEvent' |
    'DelegateCreateEvent' |
    'DelegateRemoveEvent' |
    'AccountFollowEvent' |
    'AccountUnFollowEvent' |
    'ProfileUpdateEvent' |
    'PublicationCreate' |
    'PublicationRemove' |
    'PublicationCreateWithRef' |
    'PublicationRemoveWithRef' |
    'ReactionRemoveEventWithRef' |
    'ReactionCreateEventWithRef' |
    'ReactionCreateEvent' |
    'ReactionRemoveEvent' |
    'CommunityRegisteredEvent' |
    'MemberJoinEvent' |
    'MembershipChangeEvent' |
    'MembershipDeleteEvent' |
    'MembershipReclaimEvent' |
    'CommunityUpdateEvent';


export type EVENT_STATUS = "success" | "failed" | "skipped"




export type Context = {
    db: typeof db
}


export type Resolver<P = any, A = any, C = any, R = any> = (parent: P, args: A, context: C) => any | Promise<R>

export type Pagination = {
    size: number
    page: number
}

export type PaginationArg = {
    pagination: Pagination
}

export type SORT_ORDER = "ASC" | "DESC"

export type AccountViewer = {
    follows: boolean,
    followed: boolean
}