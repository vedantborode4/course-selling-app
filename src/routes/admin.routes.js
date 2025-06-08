const express = require('express');
const { Router } = express;
// const Router = express.Router();
const {Admin} = require('../models/admin.model.js'); 
const z = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { adminAuthMiddleware } = require('../middlewares/admin.auth.middleware.js');
const { Course } = require('../models/course.model.js');

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

const courseUpdateZodSchema = z.object({
        title: z.string(),
        description: z.string(),
        imgURL: z.string(),
        price: z.number(),
        courseId: z.string(),
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

adminRouter.post("/course", adminAuthMiddleware , async (req, res) => {

    const adminId = req.adminId

    const { title, description, imgURL, price } = req.body

    const course = await Course.create({
        title: title,
        description: description,
        imgURL: imgURL,
        price: price,
        instructorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
});

adminRouter.put("/course", adminAuthMiddleware, async (req, res) => {
    try {
        const adminId = req.adminId;
        console.log(adminId)

        const parsedData = courseUpdateZodSchema.safeParse(req.body)
        if(!parsedData.success){
            return res.json({
                message: parsedData.error.errors
            })
        } 

        const course = await Course.updateOne({
            _id: parsedData.data.courseId,
            instructorId: adminId
        }, {
            title: parsedData.data.title,
            description: parsedData.data.description,
            price: parsedData.data.price,
            imgURL: parsedData.data.imgURL
        })

        res.json({
            message: "Course updated",
            courseId: course._id
        })

    } catch (error) {
        message: `Course update failed : ${error}`   
    }
});

adminRouter.get("/course/bulk", adminAuthMiddleware, async (req, res) => {
    try {
        const adminId = req.adminId

        const course = await Course.find({
            instructorId: adminId
        })

        res.json({
            message: "all courses",
            course
        })

    } catch (error) {
        message: `Failed to load course`
        error: error
    }
});

exports.adminRouter = adminRouter;