import LoginMessage from "@/app/_components/LoginMessage";
import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { Cabin, User } from "../_lib/types";
import { BookedDatesProvider } from "./BookedDatesContext";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";

async function Reservation({ cabin }: { cabin: Cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id as unknown as string),
  ]);

  const session = await auth();

  return (
    <BookedDatesProvider bookedDates={bookedDates}>
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm
          cabin={cabin}
          user={session.user as User}
        />
      ) : (
        <LoginMessage />
      )}
    </div>
    </BookedDatesProvider>
  );
}

export default Reservation;
