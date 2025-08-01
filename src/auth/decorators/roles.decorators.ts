import { SetMetadata } from "@nestjs/common"
import { UserRole } from "../entities/user.entity"



const ROLES_KEY = 'roles'

export const Roles = (...args: UserRole[]) => {
    return SetMetadata(ROLES_KEY, args)
}