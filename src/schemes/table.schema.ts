import { number, object, string, TypeOf, date, preprocess } from "zod";

export const getTablesSchema = object({
  query: object({
    status: string({ required_error: "status is required" }),
    min_seats: string({ required_error: "min seats is required" }),
    start_date:  preprocess((arg) => {
        if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
      }, date()).refine((date) => {
        return date > new Date(Date.now());
      }, "The date must be before today"),
    duration: string({ required_error: "duration date is required" }),
  }),
});

export type GetTablesQuery = TypeOf<typeof getTablesSchema>["query"];
