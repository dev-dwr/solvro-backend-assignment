import { getTablesSchema } from "./schemes/table.schema";
import { Express, Request, Response } from "express";
import validateResource from "./middleware/validateResources";
import { createReservationSchema, deleteRequestSchema, requestCancellationSchema } from "./schemes/reservation.schema";
import {
  createReservationHandler,
  getReservationOnGivenDate,
  cancelRequestReservationHandler,
  deleteReservationHandler
} from "./controllers/reservation.controller";
import { getFreeTablesHandler } from "./controllers/table.controller";

const routes = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.get("/api/reservations", getReservationOnGivenDate);
  app.post(
    "/api/reservations",
    validateResource(createReservationSchema),
    createReservationHandler
  );

  app.get(
    "/api/tables",
    validateResource(getTablesSchema),
    getFreeTablesHandler
  );

  app.put("/api/reservations/:id", validateResource(requestCancellationSchema), cancelRequestReservationHandler)
  app.delete("/api/reservations/:id", validateResource(deleteRequestSchema), deleteReservationHandler)
};

export default routes;
