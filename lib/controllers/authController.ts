import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../modules/users/schema';
import UserService from '../modules/users/service';
import IJwtPayload from '../modules/JWTPayload';
import RevokedTokenService from '../modules/revokedToken/service';

export class AuthController {
  private user_service: UserService = new UserService();
  private revoked_token_service: RevokedTokenService = new RevokedTokenService();


  public async signin(req: Request, res: Response): Promise<Response> {
    const _SECRET: string = 'api+jwt';

    try {
      // Fetch user from database
      const userFound = await this.user_service.filterOneUser({ email: req.body.email });

      // Check if user exists
      if (!userFound) {
        return res.status(401).json({
          token: null,
          message: "El usuario o la contraseña son incorrectos.",
        });
      }

      const user_params = new User({
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        email: userFound.email,
        phone_number: userFound.phone_number,
        gender: userFound.gender,
        password: userFound.password,
        birth_date: userFound.birth_date,
        role: userFound.role,
        user_deactivated: userFound.user_deactivated,
        creation_date: userFound.creation_date,
        modified_date: userFound.modified_date,
      });

      // Validate password
      const validPassword = await user_params.validatePassword(req.body.password);

      // Check if password is valid
      if (!validPassword) {
        return res.status(401).json({
          token: null,
          message: "El usuario o la contraseña son incorrectos.",
        });
      }

      // Create JWT payload
      const session = { id: userFound._id } as IJwtPayload;

      // Sign JWT token
      const token = jwt.sign(session, _SECRET, {
        expiresIn: 86400, // 24 hours
      });

      // Send response with token
      return res.json({ token: token, _id: userFound._id, first_name: userFound.first_name });

    } catch (error) {
      console.error('Error during sign in:', error);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }

  public async signinWithGoogle(req: Request, res: Response): Promise<Response> {
    console.log('Log in With Google');
    const _SECRET: string = 'api+jwt';
    console.log("Token: "+ req.body.token);
    console.log("Mail: "+req.body.mail);
    if(req.body.email && req.body.token){
    try {
      // Verificar el token recibido de Google
      const googleToken = req.body.token;
      console.log(req.body.token);
      
      //Validar token de google con librería
      /*
      const googleTokenVerified = true; 

      if (!googleTokenVerified) {
        return res.status(401).json({
          token: null,
          message: "Token de Google inválido.",
        });
      }
      */

      // Obtenemos el correo electrónico del usuario desde el token de Google
      const userEmail = req.body.email;
      console.log("mail: "+req.body.email);
      // Verificar si el usuario existe en la base de datos
      const userFound = await this.user_service.filterOneUser({ email: userEmail });

      if (!userFound) {
        return res.status(401).json({
          token: null,
          message: "Usuario no encontrado.",
        });
      }

      // Creamos un JWT payload
      const session = { id: userFound._id } as IJwtPayload;

      // Firmar el token JWT
      const token = jwt.sign(session, _SECRET, {
        expiresIn: 86400, // 24 horas
      });

      // Enviar respuesta con el token
      return res.status(200).json({ token: token, _id: userFound._id, first_name: userFound.first_name });

    } catch (error) {
      console.error('Error durante el inicio de sesión con Google:', error);
      return res.status(500).json({
        message: 'Error interno del servidor',
      });
    }
  }
  else{
    console.error('Missing fields');
      return res.status(403).json({
        message: 'Missing fields',
      });
  }
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.header('x-access-token'); // Cambiado a 'x-access-token'

      if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
      }

      await this.revoked_token_service.revokeToken(token);

      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

}
