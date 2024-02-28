import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
import * as admin from 'firebase-admin';
const { db } = require("../config/firebase");

const router = express.Router()
type QuerySnapshot = admin.firestore.QueryDocumentSnapshot;
router.post('/posts/like/remove', verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const {itemId} = req.body
    const loggedInUser: string | undefined = req.userId;

    try {
        const loggedInUserPath = db.doc("users/" + loggedInUser);
        const postRef = db.collection('posts');
        const findPost = await postRef.where('itemId', '==', itemId).limit(1).get();

        const promise = findPost.docs.map(async (item: QuerySnapshot) => {
            const docRef = await postRef.doc(item.id).collection('likes').where("liked", "==", loggedInUserPath.path).limit(1).get()
            
            if(!docRef.empty)
            docRef.docs.map(async (doc: QuerySnapshot) => {
                await db.collection('posts').doc(item.id).collection('likes').doc(doc.id).delete().then(() => {
                    console.log("deleted")
                })
            })
        })
        await Promise.all(promise)
        // findPost.forEach(async (item: QuerySnapshot) => {
        //     const docRef = db.collection('posts').doc(item.id).collection('likes').where("liked", "==", loggedInUserPath).limit(1).get()
        //     await docRef.delete().then(() => {
        //         console.log("Delete successfull")
        //     })
        // });
    } catch (error) {
        console.log("Error: ", error)
    }
    

});

module.exports = router;