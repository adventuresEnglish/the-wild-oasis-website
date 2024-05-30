import { BookingData } from "./types";

export function validateBookingData(bookingData: BookingData) {
  // Add any other fields that are required for a booking
  const requiredFields = [
    "cabinId",
    "startDate",
    "endDate",
    "numNights",
    "cabinPrice",
  ];

  return requiredFields.every(
    (field) => bookingData[field] !== undefined && bookingData[field] !== null
  );
}
