"use client";

import { differenceInDays } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "../_lib/helpers";
import { Cabin, User } from "../_lib/types";
import { useBookedDates } from "./BookedDatesContext";
import { useReservation } from "./ReservationContext";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user }: { cabin: Cabin; user: User }) {
  const [selectedOption, setSelectedOption] = useState("");

  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(startDate!, endDate!);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    cabinId: id,
    startDate,
    endDate,
    numNights,
    cabinPrice,
  };

  // const createBookingWithData = validateBookingData(bookingData)
  //   ? createBookingAction.bind(null, bookingData as ValidatedBookingData)
  //   : undefined;

  const {handleCreateBookingWithData} = useBookedDates();

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center ">
          {user.image && user.name && (
            <Image
              referrerPolicy="no-referrer"
              className="rounded-full h-8"
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
          await handleCreateBookingWithData!(bookingData, formData)
          resetRange();
          setSelectedOption("");
        }}
        //action={createBookingWithData}
        className="bg-primary-900 py-10 px-16 flex text-lg gap-5 flex-col">
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            onChange={(e) => setSelectedOption(e.target.value)}
            onInvalid={(e) => {
              (e.target as HTMLSelectElement).setCustomValidity(
                "Please select the number of guests."
              );
            }}
            onInput={(e) => {
              (e.target as HTMLSelectElement).setCustomValidity("");
            }}>
            <option
              value=""
              key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option
                value={x}
                key={x}>
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
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">
            {!startDate || !endDate
              ? "Start by selecting dates"
              : !selectedOption
              ? "Please select number of guests."
              : ""}
          </p>

          <SubmitButton
            disabled={!endDate === undefined || !selectedOption}
            pendingLabel="Reserving...">
            Reserve now
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
