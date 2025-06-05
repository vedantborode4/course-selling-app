const express = require("express");
const {Router} = express;
// const Router = express.Router();
const Course = require("../models/course.model.js");

const courseRouter = Router();

courseRouter.post("/purchase", (req, res) => {
    res.json({
        message: "Purchase endpoint"
    })
});

courseRouter.get("/preview", (req, res) => {
    res.json({
        message: "Preview endpoint"
    })
});

exports.courseRouter =  courseRouter;