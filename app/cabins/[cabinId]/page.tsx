import DisplayCabin from "@/app/_components/DisplayCabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Cabin } from "@/app/_lib/types";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: { cabinId: string };
}) => {
  const cabin = await getCabin(params.cabinId);
  return { title: `Cabin ${cabin.name}` };
};

export async function generateStaticParams() {
  const cabins: Cabin[] = await getCabins();
  return cabins.map((cabin) => ({ cabinId: cabin.id.toString() }));
}

export default async function CabinIdPage({
  params,
}: {
  params: { cabinId: string };
}) {
  //waterfall
  const cabin: Cabin = await getCabin(params.cabinId);
  //const settings = await getSettings();
  //const bookedDates = getBookedDatesByCabinId(params.cabinId);

  // this is only as fast as the slowest request THE SOLUTION IS TO stream the data in from seperate components
  //  const [cabin, settings, bookedDates] = await Promise.all([
  //     getCabin(params.cabinId),
  //     getSettings(),
  //     getBookedDatesByCabinId(params.cabinId),
  //   ])

  // in summary this really just serves as a an examplem bc Reserse Cabin Name could just as easily be rendered in DisplayCabin. We could possibly await getCabin in reservation by simply passing the params to it instead of the entire object, just as we did above. HOWEVER, this is a good example of how to avoid a waterfall situation by streaming data in from seperate components. The top doesnt have to wait for the bottom to finish rendering as it is suspended until the data is ready.

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <DisplayCabin cabinId={cabin.id} />
      <section>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </section>
    </div>
  );
}
