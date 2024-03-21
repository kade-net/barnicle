import { AccountCreateEvent, AccountFollowEvent, AccountUnFollowEvent, ProfileUpdateEvent } from "./accounts";
import { DataProcessor } from "./processor";
import { RegisterUsernameEvent } from "./usernames";

const processor = await DataProcessor.init()

processor.registerPlugin(new AccountCreateEvent())
processor.registerPlugin(new AccountFollowEvent())
processor.registerPlugin(new AccountUnFollowEvent())
processor.registerPlugin(new ProfileUpdateEvent())
processor.registerPlugin(new RegisterUsernameEvent())

export default processor