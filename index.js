import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";
import contactRoute from './contactRoute.js';

dotenv.config();



const app = express();

// using middleware
app.use(express.json());

app.use(cors({
    origin: process.env.frontendurl, // Allow requests from your frontend URL
    credentials: true, // Allow cookies and credentials
}));

const port = process.env.PORT;

app.get("/", (req, res)=>{
    res.send("Server is working");
});

app.use("/uploads",express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";


// using routes
app.use("/api", userRoutes);
app.use('/api', contactRoute);


app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
});
