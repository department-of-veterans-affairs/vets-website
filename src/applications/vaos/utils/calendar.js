import moment from 'moment';

const DEFAULT_MAX_DAYS_AHEAD = 90;

function pad(num, size) {
  let s = num.toString();
  while (s.length < size) s = `0${s}`;
  return s;
}

export function getMaxMonth(maxDate, startMonth) {
  const defaultMaxMonth = moment()
    .add(DEFAULT_MAX_DAYS_AHEAD, 'days')
    .format('YYYY-MM');

  // If provided start month is beyond our default, set that month as max month
  // This is needed in the case of direct schedule if the user selects a date
  // beyond the max date
  if (startMonth && startMonth > defaultMaxMonth) {
    return startMonth;
  }

  if (
    maxDate &&
    moment(maxDate)
      .startOf('month')
      .isAfter(defaultMaxMonth)
  ) {
    return moment(maxDate)
      .startOf('month')
      .format('YYYY-MM');
  }

  // If no available dates array provided, set max to default from now
  return defaultMaxMonth;
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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateMockSlots() {
  const times = [];
  const today = moment();
  const minuteSlots = ['00:00', '20:00', '40:00'];

  while (times.length < 300) {
    const daysToAdd = randomInt(1, 365);
    const date = today
      .clone()
      .add(daysToAdd, 'day')
      .format('YYYY-MM-DD');
    const hour = `0${randomInt(9, 16)}`.slice(-2);
    const minutes = minuteSlots[Math.floor(Math.random() * minuteSlots.length)];
    const startDateTime = `${date}T${hour}:${minutes}.000+00:00`;
    if (!times.includes(startDateTime)) {
      times.push(startDateTime);
    }
  }

  return times.sort().map(startDateTime => ({
    startDateTime,
    endDateTime: moment(startDateTime.replace('+00:00', ''))
      .add(20, 'minutes')
      .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
    bookingStatus: '1',
    remainingAllowedOverBookings: '3',
    availability: true,
  }));
}
