
import express from "express";
import config from "config";
import connectToDb from "./utils/dbConnection";
import logger from "./utils/logger";
import createServer from "./utils/serverSetUp";
import loadSeatsData from "../data/insertSeats"

const port = config.get<number>("port");

const app = createServer();

app.use(express.json());


app.listen(port, async () => {
    logger.info(`App started at http://localhost:${port}`);
    connectToDb();
    await loadSeatsData();
});