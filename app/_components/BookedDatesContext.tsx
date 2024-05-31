"use client";

import { createContext, useContext, useOptimistic } from "react";
import { createBookingAction } from "../_lib/actions";
import { TBookingData } from "../_lib/validations";

export type BookedDatesContextType = {
  optimisticBookedDates: Date[];
  handleCreateBookingWithData: (
    bookingData: TBookingData,
    formData: FormData
  ) => Promise<void>;
};

const initialState: BookedDatesContextType = {
  optimisticBookedDates: [],
  handleCreateBookingWithData: async () => {}, // Provide a default implementation
};

const BookedDatesContext = createContext<BookedDatesContextType>(initialState);

function BookedDatesProvider({
  children,
  bookedDates,
}: {
  children: React.ReactNode;
  bookedDates: Date[];
}) {
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
    (currentBookedDates, bookingData: TBookingData) => {
      const newBookedDates = [
        ...currentBookedDates,
        ...getDatesBetween(bookingData.startDate, bookingData.endDate),
      ];

      return newBookedDates;
    }
  );

  async function handleCreateBookingWithData(
    bookingData: TBookingData,
    formData: FormData
  ) {
    optimisticAdd(bookingData);
    await createBookingAction.bind(null, bookingData)(formData);
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
