import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";

export const calculateTime = (inputDateStr: string) => {
  // Assuming the input date string is in UTC format
  const inputDate = new Date(inputDateStr);

  // Get current date
  const currentDate = new Date();
  const timeDifference = Math.floor(
    (currentDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Check if it's today, tomorrow, or more than one day ago
  if (
    inputDate.getUTCDate() === currentDate.getUTCDate() &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
  ) {
    // Today: Convert to AM/PM format
    const ampmTime = inputDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    return ampmTime;
  } else if (
    inputDate.getUTCDate() === currentDate.getUTCDate() - 1 &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
  ) {
    // Tomorrow: Show "Yesterday"
    return "Yesterday";
  } else if (timeDifference > 1 && timeDifference <= 7) {
    const targetDate = new Date();
    targetDate.setDate(currentDate.getDate() - timeDifference);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const targetDay = daysOfWeek[targetDate.getDay()];

    return targetDay;
  } else {
    // More than 7 days ago: Show date in DD/MM/YYYY format
    const formattedDate = inputDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  }
};

export const calculateTimeDateFns = (inputDateStr: string) => {
  const date = parseISO(inputDateStr);

  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isThisWeek(date, { weekStartsOn: 0 })) {
    // Assuming week starts on Sunday
    return format(date, "EEEE");
  } else {
    return format(date, "yyyy-MM-dd");
  }
};
