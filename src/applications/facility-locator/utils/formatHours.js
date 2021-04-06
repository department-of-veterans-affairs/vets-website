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
    const AMorPM = hour > 12 ? 'p.m.' : 'a.m.';
    hour %= 12;
    return `${hour}:${
      minutes === 0 ? `${minutes}${minutes}` : `${minutes}`
    } ${AMorPM}`;
  }

  return null;
};
