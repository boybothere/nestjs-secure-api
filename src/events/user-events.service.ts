import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { timestamp } from "rxjs";
import { User } from "src/auth/entities/user.entity";


export interface UserRegisteredEventInterface {
    user: {
        id: number;
        email: string;
        name: string;
    },
    timestamp: Date
}
@Injectable()
export class UserEventsService {
    constructor(private eventEmitter: EventEmitter2) { }

    emitUserRegistered(user: User): void {
        const UserRegisteredEventData: UserRegisteredEventInterface = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            timestamp: new Date()
        }
        this.eventEmitter.emit('user.registered', UserRegisteredEventData)
    }

}