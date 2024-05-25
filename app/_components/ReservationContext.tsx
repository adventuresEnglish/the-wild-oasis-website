"use client";

import { createContext, useContext, useState } from "react";
import {
  ActiveModifiers,
  DateRange,
  SelectRangeEventHandler,
} from "react-day-picker";

export type ReservationContextType = {
  range: DateRange;
  setRange: (
    range: DateRange | undefined,
    selectedDay: Date,
    activeModifiers: ActiveModifiers,
    e: React.MouseEvent<Element, MouseEvent>
  ) => void;
  resetRange: () => void;
};

const initialState = {
  range: { from: undefined, to: undefined },
  setRange: () => {},
  resetRange: () => {},
};

const ReservationContext = createContext<ReservationContextType>(initialState);

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange>(initialState.range);

  const handleSetRange: SelectRangeEventHandler = (val) => val && setRange(val);

  const resetRange = () => setRange({ from: undefined, to: undefined });

  return (
    <ReservationContext.Provider
      value={{ range, setRange: handleSetRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}

export { ReservationProvider, useReservation };
