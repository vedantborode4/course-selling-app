const jwt = require("jsonwebtoken");


const JWT_SECRET = `${process.env.ADMIN_JWT_SECRET}`

function adminAuthMiddleware ( req, res, next ) {
    const token = req.headers.token;

    const isDecoded = jwt.verify(token, JWT_SECRET);

    if(isDecoded){
        req.adminId = isDecoded.id;
        next()
    }else{
        return res.json({
            message: "Please signin"
        })
    }
}

exports.adminAuthMiddleware = adminAuthMiddleware 