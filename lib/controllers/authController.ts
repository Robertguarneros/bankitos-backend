import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken';
import User from '../modules/users/schema';
import UserService from '../modules/users/service';
import IJwtPayload from '../modules/JWTPayload';

export class AuthController{
private user_service: UserService = new UserService();

public async signin(req: Request, res: Response): Promise<Response> {
    console.log('Log in');
    const _SECRET: string = 'api+jwt';
    const userFound = await this.user_service.filterOneUser({email:req.body.email});
    

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    if (userFound.password != req.body.password) return res.status(401).json({
            token: null,
            message: "Invalid Password",
        });

    const session = { 'id': userFound._id } as IJwtPayload;

    const token = jwt.sign(session, _SECRET, {
            expiresIn: 86400, // 24 hours
        });
    
    console.log (token);
    return res.json({token: token, _id: userFound._id, first_name: userFound.first_name});
};

}