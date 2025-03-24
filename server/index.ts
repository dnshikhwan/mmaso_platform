import express, { Express } from "express";
import compression from "compression";
import dotenv from "dotenv";
import { createRouter } from "./router";
import { logger } from "./helpers/log.helper";
import { requestLogger } from "./middlewares/request.middleware";
import { errorHandler } from "./helpers/error.helper";
import { prismaInit } from "./prisma/prisma";

dotenv.config();

const PORT: string | number = process.env.PORT || 5000;
const app: Express = express();

app.use(compression());
app.use(express.json());
app.use(errorHandler);
app.use(requestLogger);
app.use("/api", createRouter());

app.listen(PORT, () => {
  prismaInit();
  logger.info(`Server is running on port ${PORT}`);
});
