import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";

@Injectable()
export class LoginThrottleGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body.email || 'anonymous'
        return `login-${email}`
    }

    protected getLimit(): Promise<number> {
        return Promise.resolve(5)
    }

    protected getTtl(): Promise<number> {
        return Promise.resolve(60000)
    }

    protected async throwThrottlingException(): Promise<void> {
        throw new ThrottlerException("Exceeded login attempts, please try after 60 seconds")
    }
}