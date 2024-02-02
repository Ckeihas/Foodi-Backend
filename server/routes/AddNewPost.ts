import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
import { v4 as uuidv4 } from "uuid";
const { db, storage } = require("../config/firebase");
var admin = require("firebase-admin");
const router = express.Router()


router.post("/new-post", verifyAccessToken, async (req: express.Request, res: express.Response) => {
    const currentUser: string | undefined = req.userId;

    if(!currentUser) return res.json({
        message: 'Unauthorized',
        error: true
    })

    var bucket = storage.bucket("gs://foodi-app-8e777.appspot.com");

    // var storageRef = storage.ref();
    // var imagesRef = storageRef.child('posts/');
    const newPostData = req.body;
    bucket.upload(newPostData.jsonObject.testi)

    console.log("New post data: ", newPostData.jsonObject.imageURL)
});

module.exports = router;