export function convertTo24HourFormat(timeStr) {
  // Define the conversion for the time string
  const period = timeStr.match(/(am|pm)$/i)[0].toLowerCase();
  const timePart = timeStr.replace(/(am|pm)$/i, "").trim();
  const [hours, minutes] = timePart.split(":").map(Number);

  // Convert to 24-hour format
  let hours24 = hours;
  if (period === "pm" && hours !== 12) {
    hours24 += 12;
  } else if (period === "am" && hours === 12) {
    hours24 = 0;
  }

  // Format the hours and minutes to always have two digits
  const hoursStr = String(hours24).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = "00"; // Always "00" for this function

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
export function formatTime(dateTimeString) {
  const date = new Date(dateTimeString);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert 24-hour time to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hours should be shown as 12
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero if needed

  const formattedTime = `${hours}:${minutes} ${ampm}`;
  return formattedTime;
}



export function convertTo12HourFormat(time) {
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}


export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export function formatDateMain(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
}

export function parseTime12to24(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  return { hours, minutes };
}
export const formatTimeToAMPM = (time24) => {
  const cleanTime = time24.replace(/\s?(AM|PM)$/i, "");
  const [hourStr, minute] = cleanTime.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};


export const timeTaken = (timeStr) => {
  if (!timeStr) return "--:--";
  const [hour, minute] = timeStr.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};
