import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Rentiva server is running successfully");
});

export default app;