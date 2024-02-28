import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
import * as admin from 'firebase-admin';
const { db } = require("../config/firebase");

const router = express.Router()

type DocumentReference = admin.firestore.DocumentReference;
type QuerySnapshot = admin.firestore.QueryDocumentSnapshot;

router.post('/posts', verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const loggedInUser: string | undefined = req.userId;
    const loggedInUserPath = db.doc("users/" + loggedInUser);
    const getLastVisibleItem = req.body.data;
    
    const userRef = db.collection('users').doc(loggedInUser);
    const userDoc = await userRef.get();

    let lastVisible = ""

    try {
        if(getLastVisibleItem == undefined){
            const getPostsPromises = userDoc.data().friends.map(async (friendId: DocumentReference) => {
                const postsRef = db.collection('posts')
                const findPosts = await postsRef.where('userId', '==', friendId.id).orderBy('timestamp').limit(10).get();
                const getLastVisible = findPosts.docs[findPosts.docs.length - 1];

                if (!findPosts.empty) {
                    lastVisible = getLastVisible.ref.path;

                    const foundPostsPromises = findPosts.docs.map(async (doc: QuerySnapshot) => {
                        const docRef = db.collection('posts').doc(doc.id).collection('likes')
                        const userFoundQuery = await docRef.where('liked', '==', loggedInUserPath.path).limit(1).get();

                        const userFound = !userFoundQuery.empty
                        return {
                            imageURL: doc.data().imageURL,
                            analyzedInstructions: doc.data().analyzedInstructions,
                            description: doc.data().description,
                            extendedIngredients: doc.data().extendedIngredients,
                            userId: doc.data().userId,
                            itemId: doc.data().itemId,
                            title: doc.data().title,
                            username: doc.data().username,
                            likes: doc.data().likes,
                            isLiked: userFound
                        };
                    })
                    return Promise.all(foundPostsPromises)
 
                } else {
                    console.log("No documents found.");
                }
                
            })
            const getPosts = await Promise.all(getPostsPromises);
            const flattenedPosts = getPosts.flat().filter(Boolean);

            if(!lastVisible){
                res.json({
                    error: false,
                    endReached: true,
                    message: "You have reached to end"
                })
            } else {
                res.json({
                    error: false,
                    endReached: false,
                    userFriendsPosts: flattenedPosts,
                    lastVisibleItem: lastVisible
                })
            }
        }
        
    } catch (error) {
        console.log("Error: ", error)
        res.json({
            error: true,
            message: "something went wrong"
        })
    }
    
    
});

module.exports = router;