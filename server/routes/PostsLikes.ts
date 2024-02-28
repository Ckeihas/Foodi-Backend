import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
import * as admin from 'firebase-admin';
const { db } = require("../config/firebase");

const router = express.Router()
type QuerySnapshot = admin.firestore.QueryDocumentSnapshot;
router.post('/posts/like', verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const {itemId} = req.body
    const loggedInUser: string | undefined = req.userId;

    try {
        const loggedInUserPath = db.doc("users/" + loggedInUser);
        const postRef = db.collection('posts');
        const findPost = await postRef.where('itemId', '==', itemId).get();

        const addLikePromise = findPost.docs.map(async (item: QuerySnapshot) => {
            const docRef = await db.collection('posts').doc(item.id).collection('likes')
            await docRef.add({liked: loggedInUserPath.path}).then(() => {
                console.log("Like added")
            })
        })
        await Promise.all(addLikePromise)
        // findPost.forEach(async (item: QuerySnapshot) => {
        //     const docRef = db.collection('posts').doc(item.id).collection('likes')
        //     await docRef.add({liked: loggedInUserPath.path})
        // });
    } catch (error) {
        console.log("Error: ", error)
    }
    

});

module.exports = router;