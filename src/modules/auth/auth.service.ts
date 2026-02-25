import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existing_username = await this.users.findByUsername(username);
    const exiting_password = await this.users.findByEmail(email);

    if (existing_username)
      throw new ConflictException('Username already exists');
    if (exiting_password)
      throw new ConflictException('Email address alredyu exist');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.create({ username, email, passwordHash });

    return {
      message: 'User created',
      access_token: await this.signToken(user.id, user.email),
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return {
      message: 'Login success',
      access_token: await this.signToken(user.id, user.email),
    };
  }

  private signToken(userId: string, email: string) {
    return this.jwt.signAsync({ sub: userId, email });
  }
}
