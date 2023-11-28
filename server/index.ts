import express from "express";
import bodyParser from "body-parser";
const cors = require('cors')
const SignUpApple = require("../server/routes/SignUpApple")
const LoginApple = require("../server/routes/LoginApple")
const GetUserRoute = require("../server/routes/GetUserData")
const NewAccessTokenRoute = require("../server/tokens/NewAccessToken")
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
app.use("/new", NewAccessTokenRoute)