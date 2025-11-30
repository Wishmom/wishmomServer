// database/db.js (example)
import mongoose from "mongoose";

export async function connectDb() {
  if (mongoose.connection.readyState === 1) return; // already connected
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Mongo connected");
}
