import fs from "fs";
import TablesModel from "../src/models/tables.model";
import log from "../src/utils/logger";
import path from "path";

export async function loadSeatsData() {
  const seatsPath = path.join(__dirname, "/seats.json");
  const seatsData = fs.readFileSync(seatsPath, {
    encoding: "utf-8",
  });
  const seats = JSON.parse(seatsData);

  try {
    await TablesModel.insertMany(seats);
    log.info("Tables have been loaded");
  } catch (e: any) {
    log.error(e, "could not load seats");
  }
}


