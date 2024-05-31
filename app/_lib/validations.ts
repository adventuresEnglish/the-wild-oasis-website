import { z } from "zod";

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
