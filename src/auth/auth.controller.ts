import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth, GetRawHeaders, GetUser, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @UseGuards(AuthGuard())
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  checkAuthStatus(
    @GetUser(['id', 'email']) user: User,
    @GetRawHeaders() rawHeaders: string[],
  ) {
    console.log(rawHeaders);
    return {
      ok: true,
      message: 'Authenticated',
      user,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  checkAuthStatus2(@GetUser(['id', 'email']) user: User) {
    return {
      ok: true,
      message: 'Authenticated',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.user)
  checkAuthStatus3(@GetUser(['id', 'email']) user: User) {
    return {
      ok: true,
      message: 'Authenticated',
      user,
    };
  }
}
