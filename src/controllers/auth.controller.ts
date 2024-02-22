import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/user.repository"
import jwt from "jsonwebtoken"

export default class AuthController {
    async login(req: Request, res: Response){
        const {email, password} = req.body
        console.log(req.body.name);
        
        if (!email && !password){
            return res.status(400).send({message:"Email and Password can not be empty"})
        }

        try {
            const loginUser = await UserRepository.login(email, password)
            if (!loginUser) {
                return res.status(401).send({message:"invalid email and/or password"})
            }

            const token = jwt.sign(
                {id: loginUser.id, email: loginUser.email, confirm: loginUser.confirm},
                '123',
                {expiresIn: '12h'}
            );
            res.status(200).send({ message: "Login successful", user: {
                id: loginUser.id,
                email: loginUser.email,
                confirm: loginUser.confirm
            }, token})
        } catch (error) {
            return res.status(401).send({message:"invalid email and/or password"})
        }
    }
    
    async register(req: Request, res: Response){
        const {name, email, password} = req.body
        if (!name && !email && !password){
            res.status(400).send({message:"Email and Password can not be empty"})
            return;
        }

        try {
            const savedUser = await UserRepository.register(name, email, password)

            res.status(200).send({message: "Register successful", user: savedUser})
        } catch (error) {
            res.status(500).send({message: "Some error"})
        }
    }

    addBodyUser(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.header('Authorization');        
        
        if(!authorizationHeader || !authorizationHeader.startsWith("Bearer ")){
            return res.status(401).json({success: false, message: "Invalid authorization header"})
        } else {
            try{
                const token = authorizationHeader.replace("Bearer ", "")
                const verify = jwt.verify(token, "123")
                const decode: any = verify ? jwt.decode(token) : null
    
                if (!decode) return res.status(401).json({success: false, message: "Invalid authorization"})
    
                const userId = decode.id
                const userEmail = decode.email
                const userConfirm = decode.confirm
    
                req.body.authUser = {userId, userEmail, userConfirm}
            } catch (error) {
                if(req.baseUrl.endsWith('product')){
                } else {
                    return res.status(401).json({success: false, message: "Invalid authorization"})
                }
            }
        }

        next()
    }
}