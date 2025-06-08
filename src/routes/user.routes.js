const express = require("express");
const {Router} = express;
// const Router = express.Router();
const { User } = require("../models/user.model.js");
const z = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { userAuthMiddleware } = require("../middlewares/user.auth.middleware.js");
const { Purchase } = require("../models/purchases.model.js");

const userRouter = Router();

const userSignupZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(52), 
    firstName: z.string().min(2).max(24),
    lastName: z.string().min(2).max(24),
})

const userLoginZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(52),    
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

userRouter.post("/login", async(req, res) => {

    const { email, password } = req.body;

    try {
        const parsedData = userLoginZodSchema.safeParse(req.body)

        if(!parsedData.success){
            return res.json({
                message: parsedData.error.errors
            })
        }

        const user = await User.findOne({
            email: parsedData.data.email
        }) 
        
        if(!user){
            return res.json({
                message: `user doesn't exists `
            })
        }

        const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password)

        if(!isPasswordValid) {
            return res.json({
                message: `Invalid credentials`
            })
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
        },
         JWT_SECRET, 
        { 
            expiresIn: '1h' 
        });

        res.json({
            message: `Login successful`,
            token: token
        })

    } catch (error) {
        res.json({
            message: `Error creating user ${error}`,
        })
    }

})

userRouter.get("/purchases", userAuthMiddleware ,async (req, res) => {
    const userId = req.userId

    const purchase = await Purchase.find({userId})

    res.json({
        purchase
    })
})

exports.userRouter = userRouter;
// module.exports = userRouter;