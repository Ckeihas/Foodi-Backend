import express from "express";
import { generateTokens } from "../tokens/GenerateTokens";
import { v4 as uuidv4 } from "uuid";
import verifyRefreshToken from "../tokens/VerifyRefreshToken";
const router = express.Router();
const { db } = require("../config/firebase");

router.post("/apple", async (req: express.Request, res: express.Response) => {
    const data = req.body.data;
    console.log(data)
    const newUserId = uuidv4()
    const { accessToken, refreshToken } = await generateTokens(newUserId)
    try {
        await db.collection('users').doc(newUserId).set({
            username: data.username,
            appleId: data.appleId,
            refreshToken: refreshToken
        })
        verifyRefreshToken(refreshToken)
        return res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: newUserId
        })
    } catch (error) {
        return res.status(500).json("Error")
        
    }
});

module.exports = router