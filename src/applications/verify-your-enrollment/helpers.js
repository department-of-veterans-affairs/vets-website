export const translateDateIntoMonthYearFormat = dateString => {
  // Parse the date string
  const date = new Date(dateString);

  // Format the date with the full month name and year
  // Outputs: 'Month Year'
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export const translareDateIntoMonthDayYearFormat = dateString => {
  // Parse the date string
  const date = new Date(dateString);

  // Function to get the ordinal suffix for a given day
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th'; // for days like 4th, 5th, ... 20th
    switch (day % 10) {
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
  const dayWithSuffix = date.getDate() + getOrdinalSuffix(date.getDate());

  // Format the month and year
  const formattedMonth = date.toLocaleDateString('en-US', { month: 'long' });

  // Combine everything
  return `${formattedMonth} ${dayWithSuffix}, ${date.getFullYear()}`;
};

export const translateDatePeriod = (startDateString, endDateString) => {
  // Parse the date strings into Date objects
  const date1 = new Date(startDateString);
  const date2 = new Date(endDateString);

  // Function to format a date into MM/DD/YYYY
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
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
