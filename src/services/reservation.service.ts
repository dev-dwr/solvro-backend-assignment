import { CreateReservationInput } from "./../schemes/reservation.schema";
import ReservationModel from "../models/reservations.model";
import moment  from "moment";

export function findReservation({
  date,
  duration,
  seatNumber,
}: {
  date: Date;
  duration: number;
  seatNumber: number
}) {
  const reservationDate = moment(date);
  const endTime = moment(reservationDate).add(duration, duration === 1 ? "hour" : "hours")

  return ReservationModel.findOne({
    date: {
      $gte: reservationDate.toDate(),
      $lt: endTime.toDate(),
    },
    seatNumber: seatNumber
  });
}
export function findReservations({
  date,
  duration,
}: {
  date: Date;
  duration: number;
}) {
  const reservationDate = moment(date);
  const endTime = moment(reservationDate).add(duration, duration === 1 ? "hour" : "hours")
  return ReservationModel.find({
    date: {
      $gte: reservationDate.toDate(),
      $lt: endTime.toDate(),
    },
  });
}

export function createReservation(input: CreateReservationInput) {
  return ReservationModel.create(input);
}

export function findReservationsOnGivenDate(date: Date) {
  const givenDate = moment(date).startOf("day");
  return ReservationModel.find({
    date: {
      $gte: givenDate.toDate(),
      $lte: moment(givenDate).endOf("day").toDate(),
    },
  });
}


export function findReservationById(id: string){
  return ReservationModel.findById(id);
}

export function deleteReservationById(id: string){
  return ReservationModel.findByIdAndDelete(id)
}