"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Cabin, Settings } from "../_lib/types";
import { useBookedDates } from "./BookedDatesContext";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range: DateRange, datesArr: Date[]) {
  return datesArr.some((date) =>
    isWithinInterval(date, { start: range.from!, end: range.to! })
  );
}

type DateSelectorProps = {
  settings: Settings;
  cabin: Cabin;
  bookedDates: Date[];
};

function DateSelector({ settings, cabin, bookedDates }: DateSelectorProps) {
  const { range, setRange, resetRange } = useReservation();

  const { regularPrice, discount } = cabin;

  const displayRange = isAlreadyBooked(range, bookedDates) ? undefined : range;
  const numNights = differenceInDays(displayRange?.to!, displayRange?.from!);

  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength } = settings;

 
  //   const [optimisticBookedDates, optimisticAdd] = useOptimistic(
  //     bookedDates,
  //     (currentBookedDates, bookingData: ValidatedBookingData) => {
  //       return currentBookedDates = [...currentBookedDates, bookingData.startDate, bookingData.endDate]
  //     }
  //   );
    

  //  async function createBookingWithData(bookingData: BookingData) {
  //   validateBookingData(bookingData)
  //   ? await createBookingAction.bind(null, bookingData as ValidatedBookingData)
  //   : undefined;
  //  }

  // async function handleCreateBookingWithData(bookingData: BookingData) {
  //   optimisticAdd(bookingData as ValidatedBookingData);
  //   await createBookingWithData(bookingData);
  // }

  const {optimisticBookedDates} = useBookedDates()




  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
        optimisticBookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights && (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          )}
        </div>

        {(range?.from || range?.to) && (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
