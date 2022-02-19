
import { number, object, string, TypeOf, date, preprocess } from "zod";

export const createReservationSchema = object({
  body: object({
    date: preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, date()).refine((date) => {
      return date > new Date(Date.now());
    }, "The date must be before today"),

    duration: number({
      required_error: "Duration is required",
    })
      .max(6, "You can't reservate more than 6h")
      .min(1, "your duration should be at least 1 hour"),
    seatNumber: number({
      required_error: "Seat Number is required",
    }).positive(),
    fullName: string({
      required_error: "Full Name is required",
    }),
    phone: number({
      required_error: "Phone is required",
    }).positive(),
    email: string({ required_error: "Email is required" }).email(
      "email is not valid"
    ),
    numberOfSeats: number({
      required_error: "Number of Seats is required",
    }).positive(),
  }),
});

export type CreateReservationInput = TypeOf<
  typeof createReservationSchema
>["body"];

export const requestCancellationSchema = object({
  body: object({
    status: string({
      required_error: "status is required",
    })
  }),
  params: object({
    id: string({
      required_error: "id is required",
    }),
  }),
});


export type RequestCancellationInput = TypeOf<typeof requestCancellationSchema>["body"];
export type RequestCancellationParams = TypeOf<typeof requestCancellationSchema>["params"];


export const deleteRequestSchema = object({
  body: object({
    verificationCode: string({
      required_error: "verificationCode is required",
    })
  }),
  params: object({
    id: string({
      required_error: "id is required",
    }),
  }),
});


export type DeleteRequestInput = TypeOf<typeof deleteRequestSchema>["body"];
export type DeleteRequestParams = TypeOf<typeof deleteRequestSchema>["params"];