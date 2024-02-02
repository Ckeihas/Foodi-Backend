import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
const { db } = require("../config/firebase");
const router = express.Router()

router.post("/new-list", verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const currentUser: string | undefined = req.userId;

    if(!currentUser) return res.json({
        message: 'Unauthorized',
        error: true
    })

    const newListName = req.body.title;
    console.log("new list: ", newListName)

    const userRef = db.collection('users').doc(currentUser);
    const subcollectionRef = userRef.collection('groceryLists');

    try {
        await subcollectionRef.add({
            groceries: [],
            title: newListName
        })
    } catch (error) {
        console.log("Error when adding new subcollection doc: ", error)
    }
})

module.exports = router;