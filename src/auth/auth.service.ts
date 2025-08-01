import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService) {
    }

    async registerUser(registerDto: RegisterDto) {
        const user = await this.userRepository.findOne({
            where: { email: registerDto.email }
        })
        if (user) throw new ConflictException('User with given email already exists, try with a different email')
        const hashedPassword = await this.hashThisPassword(registerDto.password)
        const newCreatedUser = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
            role: UserRole.USER
        })
        const savingUser = await this.userRepository.save(newCreatedUser)

        const { password, ...safeUserData } = newCreatedUser

        return {
            user: { ...safeUserData },
            message: `User with email ${newCreatedUser.email} registered succesfully!`
        }
    }

    async registerAdmin(registerDto: RegisterDto) {
        const user = await this.userRepository.findOne({
            where: { email: registerDto.email }
        })
        if (user) throw new ConflictException('Admin with given email already exists, try with a different email')
        const hashedPassword = await this.hashThisPassword(registerDto.password)
        const newCreatedUser = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
            role: UserRole.ADMIN
        })
        const savingUser = await this.userRepository.save(newCreatedUser)

        const { password, ...safeUserData } = newCreatedUser

        return {
            user: { ...safeUserData },
            message: `Admin with email ${newCreatedUser.email} registered succesfully!`
        }
    }

    async loginUser(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        })
        if (!user || !(await this.verifyUser(loginDto.password, user.password))) {
            throw new UnauthorizedException("Invalid credentials ot the account doesn't exist!")
        }

        const tokens = this.generateTokens(user)
        const { password, ...rest } = user

        return {
            user: rest,
            ...tokens
        }
    }

    private async hashThisPassword(password: string): Promise<string> {
        const hashed = await bcrypt.hash(password, 10)
        return hashed
    }

    private async verifyUser(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword)
    }

    private generateTokens(user: User) {
        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user)
        }
    }

    private generateAccessToken(user: User): string {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        }
        return this.jwtService.sign(payload, {
            secret: 'jwt_secret',
            expiresIn: '15m'
        })

    }

    private generateRefreshToken(user: User): string {
        const payload = {
            sub: user.id,
        }
        return this.jwtService.sign(payload, {
            secret: 'refresh_secret',
            expiresIn: '7d'
        })
    }

    async refreshToken(token): Promise<{ newAccessToken: string }> {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: 'refresh_secret'
            })
            const user = await this.userRepository.findOne({
                where: { id: payload.sub }
            })
            if (!user) throw new UnauthorizedException();
            const newAccessToken = this.generateAccessToken(user)
            return { newAccessToken }
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    async getUserById(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['posts']
        })

        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        const { password, ...rest } = user
        return rest
    }
}
