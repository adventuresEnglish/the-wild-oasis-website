"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import supabase from "./supabase";
import { Booking, Session } from "./types";

export async function updateGuestAction(formData: FormData) {
  const session = (await auth()) as Session;

  if (!session) throw new Error("You are not logged in.");

  const nationalID = formData.get("nationalID") as string; // could also be type file
  const nationality = formData.get("nationality"); //as string;
  //const natData = formData.get("nationality") as string;
  //const [nationality, countryFlag] = natData.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Invalid national ID");

  const updateData = { nationality, nationalID };
  //const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session?.user?.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/profile");
  //redirect("/account/profile");

  //apparently the router cache should be invalidated after 30 seconds but mine is invalidated immediately so this doesn't seem necessary, at least in development
  //update. I just read that cache is that the router cache is invalidated immediately in development mode but no in production mode
}

export async function deleteReservation(bookingId: number) {
  const session = (await auth()) as Session;
  if (!session) throw new Error("You are not logged in.");

  //The next few lines of code create a list of bookings for the current user and then checks if the bookingId is in the list. If it is not, the user is not authorized to delete the booking.
  const guestBookings: Booking[] = await getBookings(
    session?.user?.guestId ?? ""
  );
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are not authorized to delete this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
