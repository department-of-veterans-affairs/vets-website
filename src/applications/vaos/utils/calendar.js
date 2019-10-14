function pad(num, size) {
  let s = num.toString();
  while (s.length < size) s = `0${s}`;
  return s;
}

function getWeekdayOfFirstOfMonth(momentDate) {
  return momentDate.startOf('month').format('d');
}

function getInitialBlankCells(momentDate) {
  const firstWeekday = getWeekdayOfFirstOfMonth(momentDate);

  if (firstWeekday === 0 || firstWeekday === 6) {
    return [];
  }

  const blanks = [];
  for (let i = 1; i < firstWeekday; i++) {
    blanks.push(null);
  }

  return blanks;
}

export function getWeekdays(momentDate) {
  let dayOfWeek = Number(getWeekdayOfFirstOfMonth(momentDate));
  const daysToShow = [];

  // Create array of weekdays
  for (let i = 1; i <= momentDate.daysInMonth(); i++) {
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysToShow.push(
        `${momentDate.format('YYYY')}-${momentDate.format('MM')}-${pad(i, 2)}`,
      );
    }
    dayOfWeek = dayOfWeek + 1 > 6 ? 0 : dayOfWeek + 1;
  }
  return daysToShow;
}

function getCells(momentDate) {
  const cells = [
    ...getInitialBlankCells(momentDate),
    ...getWeekdays(momentDate),
  ];

  // Add blank cells to end of month
  while (cells.length % 5 !== 0) cells.push(null);

  return cells;
}

export function getCalendarWeeks(momentDate) {
  const dateCells = getCells(momentDate);
  const weeks = [];
  let currentWeek = [];

  for (let index = 0; index < dateCells.length; index++) {
    if (index > 0 && index % 5 === 0) {
      weeks.push(currentWeek);
      currentWeek = [dateCells[index]];
    } else {
      currentWeek.push(dateCells[index]);
    }
  }
  weeks.push(currentWeek);
  return weeks;
}

export function isDateInSelectedArray(date, selectedArray) {
  return selectedArray?.filter(d => d.date === date)?.length > 0;
}

export function isDateOptionPairInSelectedArray(
  dateObj,
  selectedArray,
  option,
) {
  for (let index = 0; index < selectedArray.length; index++) {
    const currentDateObj = selectedArray[index];
    if (
      currentDateObj.date === dateObj.date &&
      currentDateObj[option] === dateObj[option]
    ) {
      return true;
    }
  }
  return false;
}

export function removeDateFromSelectedArray(date, selectedArray) {
  return selectedArray.filter(d => d.date !== date);
}

export function removeDateOptionPairFromSelectedArray(
  dateObj,
  selectedArray,
  fieldName,
) {
  return selectedArray.filter(
    d =>
      d.date !== dateObj.date ||
      (d.date === dateObj.date && d[fieldName] !== dateObj[fieldName]),
  );
}
