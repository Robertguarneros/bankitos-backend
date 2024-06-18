import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../modules/users/schema';
import UserService from '../modules/users/service';
import IJwtPayload from '../modules/JWTPayload';
import RevokedTokenService from '../modules/revokedToken/service';
import { io } from '../config/app';
import { OAuth2Client } from 'google-auth-library';
var verifier = require('google-id-token-verifier');

export class ReactAuthController {
  private user_service: UserService = new UserService();
  private revoked_token_service: RevokedTokenService = new RevokedTokenService();
  private google_client: OAuth2Client = new OAuth2Client(
    '445123380978-mvj74v61pr1rv34d7a6st0e8e65l5alh.apps.googleusercontent.com',
  );

  public async googleLogin(req: Request, res: Response): Promise<Response> {
    const _SECRET: string = 'api+jwt';
    const idToken = req.body.idToken;
    try {
      const ticket = await this.google_client.verifyIdToken({
        idToken: idToken,
        audience: '445123380978-mvj74v61pr1rv34d7a6st0e8e65l5alh.apps.googleusercontent.com', // Replace with your actual Google client ID
      });
      const payload = ticket.getPayload();
      const email = payload['email'];

      // Check if user exists in your database
      const userFound = await this.user_service.filterOneUser({ email });

      if (!userFound) {
        return res.status(401).json({
          token: null,
          message: 'User not registered',
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
      console.error('Error during Google login:', error);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
}
