"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FILTER_BUTTONS } from "../_lib/constants";
import { TFilter } from "../_lib/types";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleFilter(filter: TFilter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const activeFilter = searchParams.get("capacity") ?? "all";
  if (!["all", "small", "medium", "large"].includes(activeFilter)) {
    throw Error("Invalid capacity filter");
  }
  const validActiveFilter = activeFilter as TFilter;

  return (
    <div className="border border-primary-800 flex">
      {FILTER_BUTTONS.map(({ filter, label }) => (
        <Button
          key={filter}
          filter={filter}
          activeFilter={validActiveFilter}
          onHandleFilter={() => handleFilter(filter)}>
          {label}
        </Button>
      ))}
    </div>
  );
}

export default Filter;

type ButtonProps = {
  filter: TFilter;
  children: React.ReactNode;
  activeFilter: TFilter;
  onHandleFilter: () => void;
};

function Button({
  filter,
  children,
  activeFilter,
  onHandleFilter,
}: ButtonProps) {
  return (
    <button
      onClick={onHandleFilter}
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}>
      {children}
    </button>
  );
}
