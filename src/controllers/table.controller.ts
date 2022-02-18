import { Request, Response } from "express";
import { findTables } from "../services/table.service";
import { findReservations } from "../services/reservation.service";
import { omit } from "lodash";

interface getFreeTablesResult {
  number: number;
  minNumberOfSeats: number;
  maxNumberOfSeats: number;
}
export async function getFreeTablesHandler(req: Request, res: Response) {
  const qsDate = req.query.start_date as string;
  const date = new Date(qsDate);
  const durationQs = req.query.duration as string;
  const duration = parseInt(durationQs);
  const status = req.query.status as string;
  const min_seats = req.query.min_seats as string;
 
  try {
    const allTablesOfStatusFree = await findTables(status);
    const tables = allTablesOfStatusFree.filter(
      (table) => table.minNumberOfSeats >= parseInt(min_seats)
    );

    const reservationsOfGivenTime = await findReservations({ date, duration });
    const takenSeatsInGivenTime: number[] = [];
    reservationsOfGivenTime.map((reservation) =>
      takenSeatsInGivenTime.push(reservation.seatNumber)
    );
    const result: getFreeTablesResult[] = [];

    tables.forEach((table) => {
      if (!takenSeatsInGivenTime.includes(table.number))
        return result.push(omit(table.toJSON(), ["_id", "__v", "status"]));
    });

    return res.status(200).json({ tables: result });
  } catch (e: any) {
    return res
      .status(400)
      .send("error while getting all free tables on given date");
  }
}
