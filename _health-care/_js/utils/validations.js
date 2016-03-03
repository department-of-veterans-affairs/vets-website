function isValidSSN(value) {
  return /^\d{3}-\d{2}-\d{4}$/.test(value);
}

function isValidDate(day, month, year) {
  // Use the date class to see if the date parses back sanely as a
  // validation check. Not sure this is a great idea...
  const adjustedMonth = Number(month) - 1;  // JS Date object 0-indexes months. WTF.
  const date = new Date(year, adjustedMonth, day);
  return date.getDate() === Number(day) &&
    date.getMonth() === adjustedMonth &&
    date.getFullYear() === Number(year);
}

function isValidPhone(value) {
  return /^\d{3}-\d{3}-\d{4}$/.test(value);
}

export {
  isValidDate,
  isValidSSN,
  isValidPhone
};
