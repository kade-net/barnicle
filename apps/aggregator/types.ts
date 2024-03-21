

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