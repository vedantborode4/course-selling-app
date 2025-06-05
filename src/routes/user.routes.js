const express = require("express");
const {Router} = express;
// const Router = express.Router();

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
    res.json({
        message: "Signup endpoint"
    })
});

userRouter.post("/login", (req, res) => {
    res.json({
        message: "login endpoint"
    })
})

userRouter.get("/purchases", (req, res) => {
    res.json({
        message: "purchases endpoint"
    })
})

exports.userRouter = userRouter;
// module.exports = userRouter;