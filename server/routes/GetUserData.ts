import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
const { db } = require("../config/firebase");

const router = express.Router()

router.post("/profile", verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const loggedInUser: string | undefined = req.userId;

    if(!loggedInUser) return res.json("Unauthorized")

    const cityRef = db.collection('users').doc(loggedInUser);
    const doc = await cityRef.get();
    console.log("Username: ", doc.data().username)
    if (!doc.exists) {
        console.log('No such document!');
        res.json({
            message: 'User not found',
            error: true
        })
    } else {
        res.json({
            error: false,
            username: doc.data().username
        })
    }
});

module.exports = router;