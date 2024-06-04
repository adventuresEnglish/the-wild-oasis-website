import { z } from "zod";
import { COUNTRIES } from "./constants";

export const bookingDataSchema = z.object({
  cabinId: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  numNights: z.number(),
  cabinPrice: z.number(),
});

export type TBookingData = z.infer<typeof bookingDataSchema>;

export const newBookingSchema = bookingDataSchema.extend({
  guestId: z.number(),
  numGuests: z.number(),
  observations: z.string().max(1000).optional(),
  extrasPrice: z.number(),
  totalPrice: z.number(),
  isPaid: z.boolean(),
  hasBreakfast: z.boolean(),
  status: z.enum(["unconfirmed", "confirmed"]),
});

export type TNewBooking = z.infer<typeof newBookingSchema>;

export const updateGuestSchema = z.object({
  nationality: z.enum(COUNTRIES),
  nationalId: z.string().refine((value) => /^[a-zA-Z0-9]{6,12}$/.test(value), {
    message: "National ID must only contain letters and numbers",
  }),
});
