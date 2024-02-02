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

type jotain = {
    id: string
}

router.post("/access-token", (req: express.Request, res: express.Response) => {
    const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;

    type list = {
        title: string,
        items: string[]
    }
    if(privateKey){
    verifyRefreshToken(req.body.refreshToken)
        .then(async (resp: any) => {
            const { tokenDetails } = resp as { tokenDetails: AccessTokenPayload };
            console.log("ID: ",tokenDetails._id)
            const payload = { _id: tokenDetails._id};
            const accessToken = jwt.sign(
                payload,
                privateKey,
                { expiresIn: "14s" }
            );

            const userDoc = db.collection('users').doc(tokenDetails._id);
            
            userDoc.collection('groceryLists').get().then((snapshot: any) => {
                const groceryLists: any = [];
                snapshot.forEach( (doc: any) => {
                    const groceryListData = doc.data();
                    // Pushing each grocery list data to an array
                    groceryLists.push(groceryListData);
                });
                if (!userDoc.exists) {
                    console.log('No such document!');
                    res.json({
                        message: 'User not found',
                        error: true
                    })
                } else {
                    res.status(200).json({
                        error: false,
                        accessToken,
                        message: "Access token created successfully",
                        groceryLists: groceryLists
                    })
                }
            })
        })
        .catch((err) => res.status(400).json(err));
    }
})

module.exports = router;