import express from "express"
import verifyRefreshToken from "./VerifyRefreshToken"
import jwt, { JwtPayload } from "jsonwebtoken"
const { db } = require("../config/firebase");
const router = express.Router()

interface AccessTokenPayload {
    _id: string;
    iat: number;
    exp: number;
}

const getUserData = async () => {
    
}

router.post("/new-access", (req: express.Request, res: express.Response) => {
    const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;

    if(privateKey){
    verifyRefreshToken(req.body.refreshToken)
        .then((resp: any) => {
            const { tokenDetails } = resp as { tokenDetails: AccessTokenPayload };
            console.log("ID: ",tokenDetails._id)
            const payload = { _id: tokenDetails._id};
            const accessToken = jwt.sign(
                payload,
                privateKey,
                { expiresIn: "14s" }
            );
            res.status(200).json({
                error: false,
                accessToken,
                message: "Access token created successfully",
            });
        })
        .catch((err) => res.status(400).json(err));
    }
});

module.exports = router;