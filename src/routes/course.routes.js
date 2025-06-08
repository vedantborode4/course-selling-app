const express = require("express");
const {Router} = express;
// const Router = express.Router();
const { Course } = require("../models/course.model.js");
const { userAuthMiddleware } = require("../middlewares/user.auth.middleware.js");
const z = require("zod");
const { Purchase } = require("../models/purchases.model.js");

const courseRouter = Router();

const courseIdZodSchema = z.object({
    courseId: z.string()
})

courseRouter.post("/purchase", userAuthMiddleware , async (req, res) => {

    const userId = req.userId
    const parsedData = courseIdZodSchema.safeParse(req.body)

    //verify the payment recieved

    try {
        await Purchase.create({
            userId: userId,
            courseId: parsedData.data.courseId
        })
        
        res.json({
            message: "You have brought the course"
        })
    } catch (error) {
        res.json({
            message: "course purchase failed"
        })
    }
});

courseRouter.get("/preview", async (req, res) => {

    const courses = await Course.find({})

    res.json({
        courses
    })
});

exports.courseRouter =  courseRouter;