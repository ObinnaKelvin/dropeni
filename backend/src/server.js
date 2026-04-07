import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express' 
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import adminRoutes from "./routes/admin.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";

const app = express();

const __dirname = path.resolve();
const port = process.env.PORT || ENV.PORT || 5004;

app.use(express.json()); // Middleware to parse JSON bodies from incoming requests
app.use(clerkMiddleware()); // Add Clerk middleware to parse authentication data from requests
app.use(cors({ credentials: true })); // Enable CORS for all routes, allowing requests from any origin. Adjust as needed for production.

app.use("/api/inngest", serve({ client: inngest, functions })); // Serve Inngest functions at the /inngest endpoint

app.get("/", (req, res) => {
    res.send("Hello World!")
})
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Health is Great!" })
})

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

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
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('❌❌Error starting the server:', error);
        process.exit(1); //exit code 1 means failure, 0 means success
    }   
}

startServer();
