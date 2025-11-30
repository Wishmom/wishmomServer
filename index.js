import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";
import contactRoute from './contactRoute.js';

dotenv.config();



const app = express();

// using middleware
app.use(express.json());

// Support multiple allowed frontend origins via FRONTEND_URLS (comma-separated)
const allowedOrigins = (process.env.FRONTEND_URLS && process.env.FRONTEND_URLS.split(",")) || [process.env.frontendurl || "http://localhost:5173"];

// Log incoming requests (helps when diagnosing timeouts in deployed environments)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - origin: ${req.headers.origin || "<no-origin>"}`);
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin like mobile apps or server-to-server requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`CORS: blocked request from origin ${origin}`);
        return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

const port = process.env.PORT;

app.get("/", (req, res)=>{
    res.send("Server is working");
});

// Lightweight health-check endpoint (useful to keep free hosting warm or debug cold-starts)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use("/uploads",express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";


// using routes
app.use("/api", userRoutes);
app.use('/api', contactRoute);


app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
    console.log('Allowed CORS origins:', allowedOrigins.join(', '));
    connectDb();
});
