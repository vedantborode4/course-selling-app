const express = require("express");
const {Router} = express;
// const Router = express.Router();
const { User } = require("../models/user.model.js");
const z = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const userRouter = Router();

const userSignupZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(52),
    firstName: z.string().min(2).max(24),
    lastName: z.string().min(2).max(24),
})

const JWT_SECRET = `${process.env.USER_JWT_SECRET}`

userRouter.post("/signup", async(req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const parsedData = userSignupZodSchema.safeParse(req.body)
        
        if (!parsedData.success) { 
            return res.json({ 
                error: parsedData.error.errors 
            });
        }

        const existingUser = await User.findOne({ 
            email: parsedData.data.email 
        });

        if (existingUser) {
            return res.json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 4);

        const user = await User.create({
            email: parsedData.data.email,
            password: hashedPassword,
            firstName: parsedData.data.firstName,
            lastName: parsedData.data.lastName
        })

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
        },
         JWT_SECRET, 
        { 
            expiresIn: '1h' 
        });

        res.json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        res.json({ 
            message: `Error creating user ${error}`,
        });
    }
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