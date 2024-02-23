import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
import * as admin from 'firebase-admin';
const { db } = require("../config/firebase");

const router = express.Router()

interface IUserPosts {
    imageURL: string;
    title: string;
    description: string;
    extendedIngredients: { id: string, name: string; amount: string; unit: string }[];
    analyzedInstructions: {id: string, text: string, number: number}[];
    userId: string;
    itemId: string;
    username: string;
    likes: string[];
}

type DocumentReference = admin.firestore.DocumentReference;
type QuerySnapshot = admin.firestore.QueryDocumentSnapshot;

router.post('/posts', verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const loggedInUser: string | undefined = req.userId;
    const getLastVisibleItem = req.body.data;
    
    const userRef = db.collection('users').doc(loggedInUser);
    const userDoc = await userRef.get();

    const usersPosts: IUserPosts[] = [];
    let lastVisible = ""

    try {
        if(getLastVisibleItem == undefined){
            const getPosts = await userDoc.data().friends.map(async (friendId: DocumentReference) => {
                const postsRef = db.collection('posts')
                const findPosts = await postsRef.where('userId', '==', friendId.id).orderBy('timestamp').limit(10).get();
                const getLastVisible = findPosts.docs[findPosts.docs.length - 1];

                if (!findPosts.empty) {
                    lastVisible = getLastVisible.ref.path;

                    findPosts.forEach((doc: QuerySnapshot) => { 
                        usersPosts.push({
                            imageURL: doc.data().imageURL,
                            analyzedInstructions: doc.data().analyzedInstructions,
                            description: doc.data().description,
                            extendedIngredients: doc.data().extendedIngredients,
                            userId: doc.data().userId,
                            itemId: doc.data().itemId,
                            title: doc.data().title,
                            username: doc.data().username,
                            likes: doc.data().likes
                        })
                    });
                } else {
                    console.log("No documents found.");
                }
                
            })
            await Promise.all(getPosts).then(() => {
                console.log("last visible: ", lastVisible)
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
                        userFriendsPosts: usersPosts,
                        lastVisibleItem: lastVisible
                    })
                }
            })
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