import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UUID } from 'uuidgenv4';
import 'dotenv/config';
import { COOKIE_NAMES, expiresTimeTokenMilliseconds } from './constants';
import { GoogleUser } from '../interfaces/google-user.interface';
import { User } from '../schemas/user.schema';
import { CookieOptions, Response } from 'express';

const {  } = process.env;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private setJwtTokenToCookies(res: Response, user: any) {
    const expirationDateInMilliseconds = new Date().getTime() + expiresTimeTokenMilliseconds;
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      expires: new Date(expirationDateInMilliseconds)
    };

    res.cookie(
      COOKIE_NAMES.JWT,
      this.jwtService.sign({
        sub: user._id,
        username: user.email,
        roles: user.roles
      }),
      cookieOptions
    );
  }

  private encodeUserDataAsJwt(user: User) {
    const { passwordHash, ...userData } = (user as any)._doc;

    return this.jwtService.sign({ sub: userData._id, username: userData.username, roles: userData.roles, data: userData });
  }

  private async registerGoogleUser(res: Response, user: GoogleUser): Promise<string> {
    try {
      const data: any = {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        photoURL: user.picture
      };
      const newUser = await this.usersService.create(data);
      const encodedUser = this.encodeUserDataAsJwt(newUser);

      this.setJwtTokenToCookies(res, newUser);

      return encodedUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async googleSignIn(user: GoogleUser, res: Response): Promise<string> {
    if (!user) throw new BadRequestException('Unauthenticated');

    const existingUser = await this.usersService.findByEmail(user.email);
    if (!existingUser)
      return await this.registerGoogleUser(res, user);

    const encodedUser = this.encodeUserDataAsJwt(existingUser);

    this.setJwtTokenToCookies(res, existingUser);

    return encodedUser;
  }

  async signIn(res: any, email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      const correct = await compare(password, user.passwordHash);
      if (correct) {
        const encodedUser = this.encodeUserDataAsJwt(user);
        this.setJwtTokenToCookies(res, user);
        return {
          access_token: encodedUser,
          user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            gender: user.gender,
            phone: user.phone,
            photoURL: user.photoURL,
          }
        };
      }
    } catch (e) {
      return {
        error: e.message,
      };
    }
    throw new UnauthorizedException();
  }

  async signUp(res: any, createUserDto: CreateUserDto) {
    try {
      const created = await this.usersService.findByEmail((createUserDto as any).email);
      if (created) {
        if (!created.passwordHash) {
          await this.usersService.update(created._id.toString(), { password: (createUserDto as any).password })
          const encodedUser = this.encodeUserDataAsJwt(created);
          this.setJwtTokenToCookies(res, created);
          return {
            access_token: encodedUser,
            user: {
              _id: created._id,
              email: created.email,
            }
          };
        }
        throw new BadRequestException('Account already exists');
      }
      const user = await this.usersService.create(createUserDto);
      const encodedUser = this.encodeUserDataAsJwt(user);
      this.setJwtTokenToCookies(res, user);
      return encodedUser;
    } catch (e) {
      return {
        error: e.message,
      };
    }
  }

  async getProfile(id: string) {
    const user = await this.usersService.findOne(id);
    if (user) {
      const { passwordHash, __v, recoveryToken, ...data } = (user as any)._doc;
      return data;
    }
    return null;
  }

  async updateProfile(_id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.update(_id, updateUserDto);
  }

  async recoverPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    const token = (await UUID()).replaceAll('-', '');
    user.recoveryToken = token;
    const data = {
      from: 'email@yourcompany.com',
      to: email,
      subject: 'Password recovery request',
      html: ``,
    };
    // await this.mg.messages().send(data);
    return user.save();
  }

  async resetPassword(email: string, token: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user.recoveryToken == token) {
        return await this.updateProfile(user.id as string, { password });
      }
    } catch (e) {
      return {
        error: e.message,
      };
    }
    throw new UnauthorizedException();
  }
}


