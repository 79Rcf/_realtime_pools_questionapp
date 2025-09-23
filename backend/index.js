import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.js";
import errorHandler from "./src/middlewares/errorHandler.js"

dotenv.config();
const app = express();


app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);


app.use(errorHandler);

app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
