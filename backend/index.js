import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.js";
import errorHandler from "./src/middlewares/errorHandler.js"
import pollsRoutes from "./src/routes/polls.js"
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.js"
import pollAnswerRoutes from "./src/routes/pollAnswers.js"
import sessionRoutes from "./src/routes/session.js";

dotenv.config();
const app = express();


app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/polls", pollsRoutes);
app.use("/api/pollsAnswer", pollAnswerRoutes);
app.use("/api/session", sessionRoutes);

app.use(errorHandler);

app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
