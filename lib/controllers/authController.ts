import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../modules/users/schema';
import UserService from '../modules/users/service';
import IJwtPayload from '../modules/JWTPayload';

export class AuthController {
  private user_service: UserService = new UserService();

  public async signin(req: Request, res: Response): Promise<Response> {
    console.log('Log in');
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

      console.log(req.body.password);
      console.log(user_params.password);

      // Validate password
      const validPassword = await user_params.validatePassword(req.body.password);
      console.log(validPassword);

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

      console.log(token);

      // Send response with token
      return res.json({ token: token, _id: userFound._id, first_name: userFound.first_name });

    } catch (error) {
      console.error('Error during sign in:', error);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
}
