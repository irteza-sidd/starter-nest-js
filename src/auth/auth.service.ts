import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseService } from '../common/response/response.service';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private responseService: ResponseService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      throw new UnauthorizedException(
        this.responseService.error(HttpStatus.CONFLICT, 'User already exists'),
      );
    }

    const newUser = await this.usersService.create(email, password);

    return this.responseService.success(
      HttpStatus.CREATED,
      newUser,
      'User registered successfully',
    );
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION,
      }),
    };
  }
}
