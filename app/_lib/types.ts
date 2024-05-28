import { Session as NextAuthSession, User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
  guestId?: string | null;
}
export interface Session extends NextAuthSession {
  user?: User;
}

export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
};

export type Booking = {
  id: number;
  guestId: string;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  status: string;
  created_at: string;
  cabins: {
    name: string;
    image: string;
  };
};

export type Guest = {
  id: number;
  created_at: string;
  fullName: string;
  email: string;
  nationalID: string;
  nationality: string;
  countryFlag: string;
};

export type Country = {
  name: string;
  flag: string;
};

export type TFilter = "all" | "small" | "medium" | "large";

export type BookingDates = {
  startDate: string;
  endDate: string;
};

export type Settings = {
  minBookingLength: number;
  maxBookingLength: number;
  maxNumberOfGuestsPerBooking: number;
  breakfastPrice: number;
};

// export type User = {
//   name: string;
//   email: string;
//   image: string;
//   //emailVerified: Date | null;
// };
