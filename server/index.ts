import express from "express";
import bodyParser from "body-parser";
const cors = require('cors')
const SignUpApple = require("../server/routes/SignUpApple")
const LoginApple = require("../server/routes/LoginApple")
const GetUserRoute = require("../server/routes/GetUserData")
const NewAccessTokenRoute = require("../server/tokens/NewAccessToken")
const NewLoginAccessToken = require("../server/tokens/NewLoginAccessToken")
const AddNewList = require("../server/routes/AddNewList")
const SignUpEmailPassword = require("../server/routes/SignUpEmailPassword")
const NewPost = require("../server/routes/AddNewPost")
const GetPosts = require("../server/routes/GetPosts")
require('dotenv').config()

const app = express()
const port = 3000;
app.use(bodyParser.json())

app.use(cors({
    origin: 'http://192.168.1.103:3000'
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

app.use("/signup", SignUpApple)
app.use("/login", LoginApple)
app.use("/user", GetUserRoute)
app.use("/user", GetPosts)
app.use("/new", NewAccessTokenRoute)
app.use("/new-login", NewLoginAccessToken)
app.use("/groceries", AddNewList)
app.use("/signup", SignUpEmailPassword)
app.use("/add", NewPost)