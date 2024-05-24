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
