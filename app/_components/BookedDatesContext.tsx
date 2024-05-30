"use client";

import { createContext, useContext, useOptimistic } from "react";
import { createBookingAction } from "../_lib/actions";
import { BookingData, ValidatedBookingData } from "../_lib/types";
import { validateBookingData } from "../_lib/validation";

export type BookedDatesContextType = {
  optimisticBookedDates: Date[];
  handleCreateBookingWithData: (bookingData: BookingData, formData: FormData) => Promise<void>;
};

const initialState: BookedDatesContextType = {
  optimisticBookedDates: [],
  handleCreateBookingWithData: async () => {} // Provide a default implementation
};

const BookedDatesContext = createContext<BookedDatesContextType>(initialState);

function BookedDatesProvider({ children, bookedDates }: { children: React.ReactNode, bookedDates: Date[] }) {

    function getDatesBetween(startDate: Date, endDate: Date) {
        const dates = [];
        let currentDate = new Date(startDate);
      
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      
        return dates;
      }

  const [optimisticBookedDates, optimisticAdd] = useOptimistic(
    bookedDates,
    (currentBookedDates, bookingData: ValidatedBookingData) => {
        const newBookedDates = [...currentBookedDates, ...getDatesBetween(bookingData.startDate, bookingData.endDate)];
        console.log(newBookedDates);
        return newBookedDates;
    }
  );

  function createBookingWithData(bookingData: BookingData, formData: FormData) {
    return validateBookingData(bookingData)
    ? createBookingAction.bind(null, bookingData as ValidatedBookingData)(formData)
    : undefined;
  }

  async function handleCreateBookingWithData(bookingData: BookingData, formData: FormData) {
    optimisticAdd(bookingData as ValidatedBookingData);
    await createBookingWithData(bookingData, formData);
  }

  return (
    <BookedDatesContext.Provider
      value={{ optimisticBookedDates, handleCreateBookingWithData }}>
      {children}
    </BookedDatesContext.Provider>
  );
}

function useBookedDates() {
  const context = useContext(BookedDatesContext);
  if (!context) {
    throw new Error("useBookedDates must be used within a BookedDatesProvider");
  }
  return context;
}

export { BookedDatesProvider, useBookedDates };

