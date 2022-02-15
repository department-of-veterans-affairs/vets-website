const formatAMorPM = hour => {
  let result = '';
  if (hour === 24) {
    result = 'a.m.';
  } else {
    result = hour >= 12 ? 'p.m.' : 'a.m.';
  }
  return result;
};

const formatHour = hour => {
  let result = hour;
  if (hour === 24 || hour === 12) {
    result = 12;
  } else {
    result %= 12;
  }
  return result;
};

export const formatHours = hours => {
  // Eg starthours: 700  endhours: 1730
  let hour = Number(
    hours.toString().length > 3
      ? hours.toString().substring(0, 2)
      : hours.toString().substring(0, 1),
  );

  const minutes = Number(
    hours.toString().length > 3
      ? hours.toString().substring(2, 4)
      : hours.toString().substring(1, 4),
  );

  if (
    hours.toString().length >= 3 &&
    hour >= 0 &&
    hour <= 24 &&
    minutes >= 0 &&
    minutes <= 60
  ) {
    const AMorPM = formatAMorPM(hour);
    hour = formatHour(hour);
    return `${hour}:${
      minutes === 0 ? `${minutes}${minutes}` : `${minutes}`
    } ${AMorPM}`;
  }

  return null;
};
