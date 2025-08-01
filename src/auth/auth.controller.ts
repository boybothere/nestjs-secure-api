import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from './entities/user.entity';
import { Roles } from './decorators/roles.decorators';
import { RolesGuard } from './guards/roles.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LoginThrottleGuard } from './guards/login-throttle.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto)
    }


    @UseGuards(LoginThrottleGuard)
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.loginUser(loginDto)
    }


    // @Throttle({ default: { limit: 2, ttl: 5000 } })
    @Post('refresh')
    refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(refreshToken)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/')
    getProfile(@CurrentUser() user: any) {
        return this.authService.getUserById(user.id)
    }

    @Post('create-admin')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    createAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.registerAdmin(registerDto)
    }


}
