import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

//Importing Routes
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();
const Port = process.env.PORT || 9000;

app.use(cors());

app.use(express.json());

// Routes Used Here
app.use(userRoutes);
app.use(postRoutes);

//Static server
app.use(express.static("uploads"))

// Default Error handlerr
app.use((err, req, res, next) => {

    if(err.name === "ValidationError") {
        return res.status(400).json({message: err.message});
    }
    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // e.g. "username"
        const value = err.keyValue[field];

        return res.status(400).json({
            message: `${field} '${value}' already exists`
        });
    }
    
    const {status = 500, message="Something went wrong"} = err;
    res.status(status).json({message: message});
});


//Start Server
const start = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected Successfully");

        app.listen(Port, () => {
            console.log(`Server is listening at : ${Port}`);
        });
    }
    catch (error) {
    console.error("DB connection failed. Retrying in...", error.message);
        process.exit(1);
    };
};
start();
