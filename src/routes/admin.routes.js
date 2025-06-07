const express = require('express');
const { Router } = express;
// const Router = express.Router();
const {Admin} = require('../models/admin.model.js'); 
const z = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const adminRouter = Router();

const adminSignupZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(52), 
    firstName: z.string().min(2).max(24),
    lastName: z.string().min(2).max(24),
})

const adminLoginZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(52),    
})

const JWT_SECRET = `${process.env.ADMIN_JWT_SECRET}`

adminRouter.post("/signup", async(req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const parsedData = adminSignupZodSchema.safeParse(req.body)
        
        if (!parsedData.success) { 
            return res.json({ 
                error: parsedData.error.errors 
            });
        }

        const existingAdmin = await Admin.findOne({ 
            email: parsedData.data.email 
        });

        if (existingAdmin) {
            return res.json({
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 8);

        const admin = await Admin.create({
            email: parsedData.data.email,
            password: hashedPassword,
            firstName: parsedData.data.firstName,
            lastName: parsedData.data.lastName
        })

        const token = jwt.sign({
            adminId: admin._id,
            email: admin.email,
        },
         JWT_SECRET, 
        { 
            expiresIn: '1h' 
        });

        res.json({
            message: "Admin created successfully",
            token: token
        });
    } catch (error) {
        res.json({ 
            message: `Error creating admin ${error}`,
        });
    }
});

adminRouter.post("/login", async(req, res) => {

    const { email, password } = req.body;

    try {
        const parsedData = adminLoginZodSchema.safeParse(req.body)

        if(!parsedData.success){
            return res.json({
                message: parsedData.error.errors
            })
        }

        const admin = await Admin.findOne({
            email: parsedData.data.email
        }) 
        
        if(!admin){
            return res.json({
                message: `admin doesn't exists `
            })
        }

        const isPasswordValid = await bcrypt.compare(parsedData.data.password, admin.password)

        if(!isPasswordValid) {
            return res.json({
                message: `Invalid credentials`
            })
        }

        const token = jwt.sign({
            adminId: admin._id,
            email: admin.email,
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
            message: `Error creating admin ${error}`,
        })
    }
});

adminRouter.post("/course", (req, res) => {
    res.json({
        message: "Admin post course endpoint"
    }); 
});

adminRouter.put("/course", (req, res) => {
    res.json({
        message: "Admin put course endpoint"
    }); 
});

adminRouter.get("/course/bulk", (req, res) => {
    res.json({
        message: "Admin get course endpoint"
    }); 
});

exports.adminRouter = adminRouter;