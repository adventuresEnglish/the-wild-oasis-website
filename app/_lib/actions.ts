"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase";
import { Session } from "./types";

export async function updateGuestAction(formData: FormData) {
  const session = (await auth()) as Session;

  if (!session) throw new Error("You are not logged in.");

  const nationalID = formData.get("nationalID") as string;
  const natData = formData.get("nationality") as string; // could also be type file
  const [nationality, countryFlag] = natData.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Invalid national ID");

  const updateData = { nationality, countryFlag, nationalID };

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

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
