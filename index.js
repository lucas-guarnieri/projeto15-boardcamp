import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import customersRouter from "./routes/customersRouter.js";
import rentalsRouter from "./routes/rentalsRouter.js";

const server = express();
server.use(cors());
server.use(json());
dotenv.config();

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);
server.use(rentalsRouter);

const port = process.env.PORT || 5000; //TODO: MUDAR PARA 4000
server.listen(port, () => console.log(chalk.bold.green(`server running on port ${port}`)));