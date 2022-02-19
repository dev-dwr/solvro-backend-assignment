import { getModelForClass, prop } from "@typegoose/typegoose";

export class Tables {
  @prop()
  number: number;
  @prop()
  minNumberOfSeats: number;
  @prop()
  maxNumberOfSeats: number;

  @prop({ default: "FREE"})
  status: string;
}

const TablesModel = getModelForClass(Tables);

export default TablesModel;
