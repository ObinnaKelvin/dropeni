import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express' 
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json()); // Middleware to parse JSON bodies from incoming requests
app.use(clerkMiddleware()); // Add Clerk middleware to parse authentication data from requests

app.use("/api/inngest", serve({ client: inngest, functions })); // Serve Inngest functions at the /inngest endpoint

app.get("/", (req, res) => {
    res.send("Hello World!")
})
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

const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error('❌❌Error starting the server:', error);
        process.exit(1); //exit code 1 means failure, 0 means success
    }   
}

startServer();
