import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import magicLinkRoutes from "./routes/magiclink.js";

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

app.use("/auth",magicLinkRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})