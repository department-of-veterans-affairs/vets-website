import ADDRESS_DATA from 'platform/forms/address/data';

export const translateDateIntoMonthYearFormat = dateString => {
  // Parse the date string as UTC
  const [year, month, day] = dateString
    .split('-')
    .map(num => parseInt(num, 10));
  const date = new Date(Date.UTC(year, month - 1, day));

  // Format the date with the full month name and year in UTC
  // Outputs: 'Month Year'
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

export const translateDateIntoMonthDayYearFormat = dateString => {
  // Parse the date string as UTC
  if (!dateString) return null;
  const [year, month, day] = dateString
    .split('-')
    .map(num => parseInt(num, 10));
  const date = new Date(Date.UTC(year, month - 1, day));

  // Function to get the ordinal suffix for a given day
  function getOrdinalSuffix(dayOfTheMonth) {
    if (dayOfTheMonth > 3 && dayOfTheMonth < 21) return 'th'; // for dayOfTheMonths like 4th, 5th, ... 20th
    switch (dayOfTheMonth % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  // Get the day with ordinal suffix
  const dayWithSuffix = date.getUTCDate() + getOrdinalSuffix(date.getUTCDate());
  // Format the month and year
  const formattedMonth = date.toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });

  // Combine everything
  return `${formattedMonth} ${dayWithSuffix}, ${date.getUTCFullYear()}`;
};

export const translateDatePeriod = (startDateString, endDateString) => {
  // Parse the date strings into Date objects as UTC
  const parseDateUTC = dateString => {
    const [year, month, day] = dateString
      .split('-')
      .map(num => parseInt(num, 10));
    return new Date(Date.UTC(year, month - 1, day));
  };

  const date1 = parseDateUTC(startDateString);
  const date2 = parseDateUTC(endDateString);

  // Function to format a date into MM/DD/YYYY in UTC
  function formatDate(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  }

  // Format both dates and concatenate them
  return `${formatDate(date1)} - ${formatDate(date2)}`;
};

export const formatCurrency = str => {
  // Convert the string to a number
  const number = Number(str);

  // Check if the conversion is successful
  if (Number.isNaN(number)) {
    return 'Invalid input';
  }

  // Format the number as a currency string
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const scrollToElement = el => {
  const element = document.getElementById(el);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// make an object of just the military state codes and names
export const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

export const getCurrentDateFormatted = () => {
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();

  return `${month}/${day}/${year}`;
};
