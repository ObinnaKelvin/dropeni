import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express' 
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

const __dirname = path.resolve();

// app.get("/", (req, res) => {
//     res.send("Hello World!")
// })

app.use(clerkMiddleware()); //req.auth will be available in all routes after this middleware

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Health is Great!" })
})

//make our app ready for deployment by listening to a port

if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
    });
}

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`)
    connectDB();
})
