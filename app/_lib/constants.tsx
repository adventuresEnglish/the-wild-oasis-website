import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { TFilter } from "./types";

type FilterButton = {
  filter: TFilter;
  label: string;
};

export const FILTER_BUTTONS: FilterButton[] = [
  { filter: "all", label: "All cabins" },
  { filter: "small", label: "1—3" },
  { filter: "medium", label: "4—7" },
  { filter: "large", label: "8—12" },
];

export const NAV = [
  {
    name: "Home",
    href: "/account",
    icon: <HomeIcon className="h-5 w-5 text-primary-600" />,
  },
  {
    name: "Reservations",
    href: "/account/reservations",
    icon: <CalendarDaysIcon className="h-5 w-5 text-primary-600" />,
  },
  {
    name: "Guest profile",
    href: "/account/profile",
    icon: <UserIcon className="h-5 w-5 text-primary-600" />,
  },
];
