import jwt, { JwtPayload } from "jsonwebtoken";

const verifyRefreshToken = (refreshToken: string) => {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
    return new Promise((resolve, reject) => {
        if (!privateKey){
            return reject({ error: true, message: "Invalid refresh token" });
        } else {
            jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
                if(err){
                    console.log("Invalid refresh token")
                    return reject({ error: true, message: "Invalid refresh token" });
                } else {
                    console.log("VALID: ", tokenDetails)
                    resolve({
                        tokenDetails,
                        error: false,
                        message: "Valid refresh token",
                    });
                }
            })
        }
    })
    
};

export default verifyRefreshToken;