import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
const { db } = require("../config/firebase");


const router = express.Router()

type friendDataType = {
    id: string,
    username: string
}
interface IInstructions {
    number: number;
    step: string;
}
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
router.post("/profile", verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const loggedInUser: string | undefined = req.userId;

    if(!loggedInUser) return res.json("Unauthorized")

    const userRef = db.collection('users').doc(loggedInUser);
    const doc = await userRef.get();
    console.log("Username: ", doc.data())
    userRef.collection('groceryLists').get().then( async (snapshot: any) => {
        const groceryLists: any = [];
        snapshot.forEach( (doc: any) => {
            const groceryListData = doc.data();
            
            groceryLists.push(groceryListData);
        });
        

        const friendsData: friendDataType[] = [];
        const usersPosts: IUserPosts[] = [];
        const GetAllFriendsData = doc.data().friends.map(async (friend: any) => {
            //console.log("Testi: ", friend.id)
            const postsRef = db.collection('posts')
            await postsRef.where('userId', '==', friend.id).get().then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    console.log("Result: ", doc.id)
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
            })
            
            await db.doc(friend.path).get().then((docSnapshot: any) => {
                const documentData = docSnapshot.data();
                friendsData.push({
                    id: docSnapshot.id,
                    username: documentData.username
                })
            })
        });
        await Promise.all(GetAllFriendsData);
        console.log("koko lista: ", usersPosts)
        res.json({
            error: false,
            username: doc.data().username,
            groceryLists: groceryLists,
            friendsList: friendsData,
            userFriendsPosts: usersPosts,
            id: loggedInUser
        })
    });
    // if (!doc.exists) {
    //     console.log('No such document!');
    //     res.json({
    //         message: 'User not found',
    //         error: true
    //     })
    // } else {
    //     res.json({
    //         error: false,
    //         username: doc.data().username
    //     })
    // }
});

module.exports = router;