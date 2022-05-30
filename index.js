import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";

const server = express();
server.use(cors());
server.use(json());
dotenv.config();

server.use(categoriesRouter);
server.use(gamesRouter);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(chalk.bold.green(`server running on port ${port}`)));