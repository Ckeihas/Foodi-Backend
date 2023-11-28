const jwt = require('jsonwebtoken')

export const generateTokens = async (userId: string): Promise<{accessToken: string, refreshToken: string}> => {
    try {
        const payload = { _id: userId, };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14s" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        return { accessToken, refreshToken }
        } catch(err) {
            return Promise.reject(err);
        }
    }