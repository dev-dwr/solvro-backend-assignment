import { GetTablesType } from "./../schemes/table.schema";
import TablesModel from "../models/tables.model";

export function findTableBySeatNumber(seatNumber: number) {
  return TablesModel.findOne({ number: seatNumber });
}

export function findTables(status: string) {
  return TablesModel.find({ status: status.toUpperCase() });
}
