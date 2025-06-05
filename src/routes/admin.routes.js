const express = require('express');
const { Router } = express;
// const Router = express.Router();

const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
    res.json({
        message: "Admin signup endpoint"
    }); 
});

adminRouter.post("/login", (req, res) => {
    res.json({
        message: "Admin login endpoint"
    }); 
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