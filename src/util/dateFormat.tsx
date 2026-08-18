export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "N/A";

  const d = new Date(date);

  // Guard against invalid date strings (e.g., NaN)
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
