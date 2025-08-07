import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './user-events.service';
import { UserRegisteredListener } from './listeners/user-registered.listener';

@Module({
    imports: [
        EventEmitterModule.forRoot({
            global: true,
            maxListeners: 20,
            verboseMemoryLeak: true,
            ignoreErrors: false,
            wildcard: false
        })
    ],
    providers: [UserEventsService, UserRegisteredListener],
    exports: [UserEventsService]
})
export class EventsModule { }
