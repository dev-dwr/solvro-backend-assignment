import { getModelForClass, prop } from "@typegoose/typegoose";
import { Tables } from "./tables.model";
export class Reservation {
  @prop()
  date: Date;

  @prop()
  duration: number;

  @prop({ ref: () => Tables })
  table: Tables;

  @prop()
  seatNumber: number

  @prop()
  fullName: string;

  @prop()
  phone: string;

  @prop()
  email: string;

  @prop()
  numberOfSeats: number;
  
  @prop({default: "active"})
  reservationStatus: string

  @prop()
  verificationCode?: string

  @prop()
  cancellationTime: Date

}

const ReservationModel = getModelForClass(Reservation);

export default ReservationModel;
