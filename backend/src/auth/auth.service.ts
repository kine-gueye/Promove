import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Un utilisateur qui s'inscrit lui-meme est toujours un CLIENT.
    // Les comptes admin/manager sont crees par un admin via /users.
    const user = await this.usersService.create({
      ...registerDto,
    });

    return this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a ete desactive');
    }

    return this.buildAuthResponse(user);
  }

  async forgotPassword(email: string) {
    // Par securite, on ne revele jamais si l'email existe ou non en base.
    // Dans une version complete, on genererait ici un token a duree de vie
    // limitee et on enverrait un email contenant un lien de reinitialisation
    // (ex: via un service comme Nodemailer / SendGrid).
    const user = await this.usersService.findByEmail(email);
    if (user) {
      // TODO: generer un token de reinitialisation + envoyer l'email
    }
    return {
      message:
        'Si un compte existe avec cet email, un lien de reinitialisation a ete envoye.',
    };
  }

  private buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // On ne renvoie jamais le mot de passe hache au client
    const { password, ...safeUser } = user;

    return {
      accessToken,
      user: safeUser,
    };
  }
}
