import express from "express"
import verifyAccessToken from "../middleware/VerifyAccessToken"
import bcrypt from 'bcrypt'
import { generateTokens } from "../tokens/GenerateTokens";
import { v4 as uuidv4 } from "uuid";
import verifyRefreshToken from "../tokens/VerifyRefreshToken";
const { db } = require("../config/firebase");


const router = express.Router()


router.post("/email", async (req: express.Request, res: express.Response) => {
    let {username, email, password} = req.body.data;

    const newUserId = uuidv4()
    const { accessToken, refreshToken } = await generateTokens(newUserId)

    username = username.trim();
    email = email.trim();
    password = password.trim();

    if(email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Fill all the required fields"
        })
        //Name validation
    } else if(/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email address"
        })
        //Password validation
    } else if(password.length < 8){
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
        //Check if user already exists
    } else{
        const usersRef = db.collection("users");

        const findUserWithEmail = await usersRef.where("email", "==", email).get();

        if(findUserWithEmail.empty){
            console.log("Ei löytynyt")
            const sanitiziedEmail = email.toLowerCase();
            //Password handling
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds).then(async (hashedPassword: any) => {
                try {
                    await db.collection('users').doc(newUserId).set({
                        username: username,
                        email: sanitiziedEmail,
                        password: hashedPassword,
                        refreshToken: refreshToken,
                        friends: [],
                        friendRequests: [],
                        followers: []
                    })
                    verifyRefreshToken(refreshToken)
                    return res.json({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: newUserId,
                        username: username,
                        friends: [],
                        friendRequests: [],
                        followers: []
                    })
                } catch (error) {
                    console.log("error: ", error)
                    return res.status(500).json("Error")
                    
                }
            })
            
            
        } else {
            console.log("Käyttäjä on jo")
        }

        // User.find({email}).then(result => {
        //     //A user already exists
        //     if(result.length){
        //         res.json({
        //             status: "FAILED",
        //             message: "User already exists"
        //         })
              
        //     } else{
        //         //Create new user
        //         const sanitiziedEmail = email.toLowerCase();
        //         //Password handling
        //         const saltRounds = 10;          
        //         console.log("Käyttäjä valmis luotavaksi")
        //         bcrypt.hash(password, saltRounds).then(hashedPassword => {
        //             const newUser = new User({                                                                    
        //                 name,
        //                 email: sanitiziedEmail,
        //                 password: hashedPassword,
        //                 sexuality,
        //                 age,
        //                 images,     
        //             });


        //             newUser.save().then(result => {
        //                  res.json({
        //                      status: "SUCCESS",
        //                      message: "Sign up successfully",
        //                      data: result,
        //                      token: generateToken(result._id)
        //                  })
        //             })
        //             .catch(err => {
        //                 res.json({
        //                     status: "FAILED",
        //                     message: "Error occured while saving user account"
        //                 })
        //             })
        //         })
        //         .catch(err => {
        //             console.log(err)
        //             res.json({
        //                 status: "FAILED",
        //                 message: "Error occured when hashing password"
        //             })
        //         })
        //     }
        // })
        // .catch((err: any) => { 
        //     console.log(err);
        //     res.json({
        //         status: "FAILED",
        //         message: "Error when checking existing users"
        //     })
        // })
    }
});

module.exports = router;