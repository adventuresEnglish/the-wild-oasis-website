"use client";

import { useOptimistic } from "react";
import { deleteBookingAction } from "../_lib/actions";
import { Booking } from "../_lib/types";
import ReservationCard from "./ReservationCard";

function ReservationList({ bookings }: { bookings: Booking[] }) {
  //useOptimistic 1) add current state bookings. 2) add updtaing fn 3) create handleDelete fn that gets passed all the way down through ReservationCard and into deleteBookingAction, where we were previously using deleteBookingAction. Similar to how we use useReducer...
  //in the handleDelete fn we fist call optimisticDelete with the bookingId, then we await deleteBookingAction(bookingId). This way we can update the UI optimistically and then update the server.
  //the second argument is a state update fn that determines the next state, it takes the current info a some info that is needed to update the state. In this case we are filtering out the booking that matches the bookingId.
  //optimisticDelete is similar to the dispatch fn in useReducer, it takes the bookingId and updates the state.
  // bookingId, ie the second argument passed to the state updating fn is necessarily the argument passed to the onDelete in deleteBookingAction. booking is used here semantically but we could use any variable name The use of optimisticDelete is what gets the bookingId all the way into the state updating fn.
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currentBookings, bookingId) => {
      return currentBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteBookingAction(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
