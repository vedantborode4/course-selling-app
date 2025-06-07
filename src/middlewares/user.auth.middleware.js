const jwt = require("jsonwebtoken")

const JWT_SECRET = `${process.env.USER_JWT_SECRET}`

function userAuthMiddleware ( req, res, next ) {
    const token = req.headers.token;

    const isDecoded = jwt.verify(token, JWT_SECRET);

    if(isDecoded){
        req.userId = isDecoded.id;
        next()
    }else{
        return res.json({
            message: "Please signin"
        })
    }
}

exports.userAuthMiddleware = userAuthMiddleware 