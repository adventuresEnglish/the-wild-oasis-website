export const formatDate = (date: Date | undefined) => {
  return date?.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
