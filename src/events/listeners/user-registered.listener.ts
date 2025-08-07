import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserRegisteredEventInterface } from "../user-events.service";

@Injectable()
export class UserRegisteredListener {
    private readonly logger = new Logger(UserRegisteredListener.name)

    @OnEvent('user.registered')
    handleUserRegisteredEvent(event: UserRegisteredEventInterface) {
        this.logger.log(`Account with user email ${event.user.email}
            created at ${event.timestamp.toISOString}`)

    }
}