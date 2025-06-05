const express = require("express");
const { userRouter } = require("./routes/user.routes.js");
const { courseRouter } = require("./routes/course.routes.js");
const { adminRouter } = require("./routes/admin.routes.js");
require('dotenv').config({ path: __dirname + '/../.env' });

const app = express();
const port = 3000;

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter)

app.listen(port)