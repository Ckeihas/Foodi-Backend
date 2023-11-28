import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';


interface AccessTokenPayload extends JwtPayload {
    _id: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }
const verifyAccessToken = (req: Request, res: Response, next: NextFunction): void => {
    const privateKey: string | undefined = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const bearerToken: string | undefined = req.header('Authorization');
    const token = bearerToken?.split("Bearer ")[1];

    if (privateKey && token) {
        jwt.verify(token, privateKey, (err, tokenDetails) => {
            if (err) {
                console.log("Invalid token");
                // You can handle the error here if needed
                res.json({ 
                    message: 'Invalid token verify access token',
                    error: true 
                });
            } else if(tokenDetails) {
                console.log("Valid token: ", tokenDetails);
                // Token is valid; continue to the next middleware or route handler
                const userId = (tokenDetails as AccessTokenPayload)._id;
                req.userId = userId;
                next();
            }
        });
    } else {
        // Handle the case where privateKey or token is missing
        // You can return an error response here or take appropriate action
        res.json({
            status: 'FAILED',
            error: 'Something went wrong'
        })
    }
};

export default verifyAccessToken;