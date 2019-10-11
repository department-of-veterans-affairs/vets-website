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

export function convertSelectedDatesObjToArray(selectedDatesObj) {
  const selectedDates = [];

  Object.keys(selectedDatesObj).forEach(dateKey => {
    const dateObj = {
      date: dateKey,
    };
    Object.keys(selectedDatesObj[dateKey]).forEach(key => {
      dateObj[key] = selectedDatesObj[dateKey][key];
    });
    selectedDates.push(dateObj);
  });

  return selectedDates;
}

export function convertSelectedDatesArrayToObj(selectedDatesArray) {
  const selectedDateObj = {};
  for (let index = 0; index < selectedDatesArray.length; index++) {
    const dateObj = selectedDatesArray[index];
    const date = dateObj.date;
    selectedDateObj[date] = {};
    Object.keys(dateObj).forEach(key => {
      if (key !== 'date') {
        selectedDateObj[date][key] = dateObj[key];
      }
    });
  }
  return selectedDateObj;
}
