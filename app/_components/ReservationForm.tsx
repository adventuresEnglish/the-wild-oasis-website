"use client";

import { differenceInDays } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "../_lib/helpers";
import { Cabin, User } from "../_lib/types";
import { bookingDataSchema } from "../_lib/validations";
import { useBookedDates } from "./BookedDatesContext";
import { useReservation } from "./ReservationContext";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user }: { cabin: Cabin; user: User }) {
  const [selectedOption, setSelectedOption] = useState("");

  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate!, startDate!);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    cabinId: id,
    startDate,
    endDate,
    numNights,
    cabinPrice,
  };
  const validatedBookingData = bookingDataSchema.safeParse(bookingData);

  const { handleCreateBookingWithData } = useBookedDates();

  return (
    <div className="scale-[1.01]">
      <div className="flex items-center justify-between bg-primary-800 px-16 py-2 text-primary-300">
        <p>Logged in as</p>

        <div className="flex items-center gap-4">
          {user.image && user.name && (
            <Image
              referrerPolicy="no-referrer"
              className="h-8 rounded-full"
              src={user.image}
              alt={user.name}
              height={32}
              width={32}
            />
          )}
          <p>{user.name}</p>
        </div>
      </div>
      <p>
        {startDate && formatDate(startDate)}
        {startDate && endDate && " to "}
        {endDate && formatDate(endDate)}
      </p>

      <form
        action={async (formData) => {
          if (!validatedBookingData.success) {
            resetRange();
            setSelectedOption("");
            throw new Error("Invalid booking data");
          }
          await handleCreateBookingWithData(
            validatedBookingData.data,
            formData,
          );
          resetRange();
          setSelectedOption("");
        }}
        //action={createBookingWithData}
        className="flex flex-col gap-5 bg-primary-900 px-16 py-10 text-lg"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
            required
            onChange={(e) => setSelectedOption(e.target.value)}
            onInvalid={(e) => {
              (e.target as HTMLSelectElement).setCustomValidity(
                "Please select the number of guests.",
              );
            }}
            onInput={(e) => {
              (e.target as HTMLSelectElement).setCustomValidity("");
            }}
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex items-center justify-end gap-6">
          <p className="text-base text-primary-300">
            {!startDate || !endDate
              ? "Start by selecting dates"
              : !selectedOption
                ? "Please select number of guests."
                : ""}
          </p>

          <SubmitButton
            disabled={!endDate === undefined || !selectedOption}
            pendingLabel="Reserving..."
          >
            Reserve now
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
