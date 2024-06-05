import { eachDayOfInterval } from "date-fns";
//import { unstable_noStore as noStore } from "next/cache";
//import countries from "country-json/src/country-by-flag.json";
import { notFound } from "next/navigation.js";
import { supabase } from "./supabase.js";
import { Booking, BookingDates, Guest } from "./types";

/////////////
// GET

export async function getCabin(id: number) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  //For testing
  await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getNumCabins() {
  const { data, error } = await supabase.from("cabins").select("id");

  if (error) {
    console.error(error);
  }

  return data.length;
}

export async function getCabinPrice(id: string) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  //noStore();
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("id");

  //await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email?: string | null | undefined) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id: string) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("observations, numGuests, cabins(maxCapacity)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId: string) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId: number) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  //Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today.toISOString()},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  //Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking: BookingDates) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

// export async function getCountries() {
//   try {
//     const res = await fetch(
//       "https://restcountries.com/v2/all?fields=name,flag"
//     );
//     const countries: Country[] = await res.json();
//     console.log("countries", countries);
//     return countries;
//   } catch {
//     throw new Error("Could not fetch countries");
//   }
// }

// export function getCountries() {
//   const countryArray = countries as Array<{
//     country: string;
//     flag_base64: string;
//   }>;
//   const transformedCountries: Country[] = countryArray.map((country) => ({
//     name: country.country,
//     flag: country.flag_base64,
//   }));

//   // console.log(
//   //   "countries",
//   //   transformedCountries.map((c) => c.name)
//   // );
//   return transformedCountries;
// }

export async function createGuest(newGuest: Pick<Guest, "email" | "fullName">) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking: Booking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!d
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE
// export type GuestUpdate = Partial<Guest>;
// // The updatedFields is an object which should ONLY contain the updated data
// export async function updateGuest(id: string, updatedFields: GuestUpdate) {
//   const { data, error } = await supabase
//     .from("guests")
//     .update(updatedFields)
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be updated");
//   }
//   return data;
// }

export type BookingUpdate = Partial<Booking>;

export async function updateBooking(id: number, updatedFields: BookingUpdate) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
