import moment from "moment";
import {
  CreateReservationInput,
  RequestCancellationParams,
  RequestCancellationInput,
  DeleteRequestParams,
  DeleteRequestInput,
} from "./../schemes/reservation.schema";
import { Request, Response } from "express";
import {
  findReservation,
  createReservation,
  findReservationsOnGivenDate,
  findReservationById,
  deleteReservationById,
} from "../services/reservation.service";
import { findTableBySeatNumber } from "../services/table.service";
import sendEmail from "../utils/mailer";
import log from "../utils/logger";
import { customAlphabet } from "nanoid";
import { DocumentType } from "@typegoose/typegoose";
import { Tables } from "../models/tables.model";

export async function createReservationHandler(
  req: Request<{}, {}, CreateReservationInput>,
  res: Response
) {
  const { date, email, seatNumber, numberOfSeats, duration, fullName } =
    req.body;
  const reservationExists = await findReservation({
    date,
    duration,
    seatNumber,
  });
  const table = await findTableBySeatNumber(seatNumber);
  if (reservationExists) {
    return res
      .status(400)
      .json({ error: "This table is alredy taken in this time" });
  }
  if (!table) {
    return res.status(404).send("Table of given number does not exist");
  }
  if (numberOfSeats > table.maxNumberOfSeats) {
    return res
      .status(400)
      .json({ error: "It is too many seats for this table" });
  }
  if (numberOfSeats < table.minNumberOfSeats) {
    return res.status(400).json({ error: "The amount of seats is too small" });
  }
  try {
    await createReservationAndSendEmail(
      req.body,
      table,
      email,
      fullName,
      date,
      seatNumber,
      numberOfSeats,
      res
    );
  } catch (e: any) {
    log.error(e, "Error occured while creating reservation");
    return res.status(500).send(e.message);
  }
}

async function createReservationAndSendEmail(
  body: CreateReservationInput,
  table: DocumentType<Tables>,
  email: string,
  fullName: string,
  date: Date,
  seatNumber: number,
  numberOfSeats: number,
  res: Response
) {
  const createdReservation = await createReservation(body);

  table!.status = "TAKEN";
  await table!.save();
  await sendEmail({
    from: "test@example.com",
    to: email,
    subject: "Your reservation details",
    text: `Hello ${fullName} Reservation Id: ${
      createdReservation._id
    }, Date of reservation: ${moment(date).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    )}, Table: ${seatNumber}, 
      number of seats: ${numberOfSeats}`,
  });

  return res.status(201).json({ reservationId: createdReservation._id });
}
export async function getReservationOnGivenDate(req: Request, res: Response) {
  const date = req.query.date as string;
  const formattedDate = moment.utc(date, "YYYY-MM-DD").toDate();

  try {
    const result = await findReservationsOnGivenDate(formattedDate);
    return res.status(200).json({ bookings: result });
  } catch (e: any) {
    log.error(e, "error occured while getting reservation on given date");
    return res.status(400).send(e.message);
  }
}

export async function cancelRequestReservationHandler(
  req: Request<RequestCancellationParams, {}, RequestCancellationInput>,
  res: Response
) {
  const id = req.params.id;
  const cancellationStatus = req.body.status;
  const cancellationIdFunction = customAlphabet("0123456789", 6);
  const cancellationId = cancellationIdFunction();
  try {
    const reservation = await findReservationById(id);
    if (!reservation) {
      return res
        .status(400)
        .json({ error: "Reservation of given Id does not exist" });
    }

    const requestCancellationTime = new Date(Date.now());
    const twoHoursBeforeReservationTime = moment(reservation.date)
      .subtract(2, "hours")
      .toDate();

    if (requestCancellationTime > twoHoursBeforeReservationTime) {
      return res
        .status(409)
        .json({ error: "You cannot cancel reservation now it is to late" });
    }

    reservation.reservationStatus = cancellationStatus;
    reservation.verificationCode = cancellationId;
    reservation.save();

    await sendEmail({
      from: "test@example.com",
      to: reservation.email,
      subject: "Request Cancellation",
      text: `This is your cancellationId: ${cancellationId}`,
    });
    return res.status(200).send("Success");
  } catch (e: any) {
    log.error(e, "cannot send reservation cancellation request");
    return res.status(400).send(e.message);
  }
}

export async function deleteReservationHandler(
  req: Request<DeleteRequestParams, {}, DeleteRequestInput>,
  res: Response
) {
  const { id } = req.params;
  const { verificationCode } = req.body;

  try {
    const reservation = await findReservationById(id);
    const seatNumber = reservation?.seatNumber as number;
    const relatedTableToReservation = await findTableBySeatNumber(seatNumber);

    if (!reservation) {
      return res
        .status(400)
        .json({ error: "Reservation of given Id does not exist" });
    }

    if (verificationCode !== reservation.verificationCode) {
      return res.status(400).json({ error: "Wrong verification code" });
    }

    relatedTableToReservation!.status = "FREE";

    await deleteReservationById(id);
    await sendEmail({
      from: "test@example.com",
      to: reservation.email,
      subject: "Reservation Delete",
      text: `Your reservation of id ${reservation._id} has been deleted`,
    });
    return res.status(200).send("Success");
  } catch (e: any) {
    log.error(e, "cannot send confirmation of reservation deletion");
    return res.status(400).send(e.message);
  }
}
