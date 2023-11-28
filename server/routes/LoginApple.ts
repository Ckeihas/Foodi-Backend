import express from "express";
import { generateTokens } from "../tokens/GenerateTokens";
import { v4 as uuidv4 } from "uuid";
import verifyRefreshToken from "../tokens/VerifyRefreshToken";
const router = express.Router();
const { db } = require("../config/firebase");

router.post("/apple", async (req: express.Request, res: express.Response) => {
    const getAppleId = req.body.data;

    const userRef = db.collection("users")
    const getSigninUser = await userRef.where("appleId", "==", getAppleId).limit(1).get();

    if (!getSigninUser.empty) {
        // There is at least one user with the provided appleId
        const userDoc = getSigninUser.docs[0];
        const userData = userDoc.data()
        console.log(userData);
        console.log(userDoc.id);
        const {accessToken, refreshToken} = await generateTokens(userDoc.id)
        try {
            const docRef = db.collection('users').doc(userDoc.id);
            await docRef.update({refreshToken: refreshToken})
            verifyRefreshToken(refreshToken)

            return res.json({
                error: false,
                accessToken: accessToken,
                refreshToken: refreshToken,
                userId: userDoc.id
            })
        } catch (error) {
            return res.status(500).json("Error")
        }
    } else {
        // No user found with the provided appleId
        return res.json({
            error: true
        })
    }
});

module.exports = router;