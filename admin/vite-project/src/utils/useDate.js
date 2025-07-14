export const getDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short", // e.g., Jul
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
