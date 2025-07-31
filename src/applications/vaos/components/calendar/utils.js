import {
  addDays,
  addMonths,
  addMinutes,
  areIntervalsOverlapping,
  format,
  isAfter,
  endOfMonth,
  getDaysInMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { APPOINTMENT_STATUS, DATE_FORMATS } from '../../utils/constants';
/**
 * Ensures the input is a Date object, converting from string if needed
 * @param {Date|string} value - Date object or date string
 * @returns {Date} Date object
 */
function ensureDate(value) {
  if (value instanceof Date) {
    return value;
  }
  return parseISO(value);
}

/**
 * Checks if a selected appointment time conflicts with existing appointments
 *
 * This function determines whether the user's selected appointment slot overlaps
 * with any of their existing upcoming appointments. It uses UTC timestamps to
 * avoid timezone conversion issues and only checks conflicts for single selections.
 *
 * @param {string} selectedDate - date string in ISO format
 * @param {Object} upcomingAppointments - Object containing upcoming appointments organized by month key (YYYY-MM)
 * @param {Array<Object>} availableSlots - Array of available appointment slots
 * @param {string} availableSlots[].start - ISO date string for slot start time
 * @param {string} availableSlots[].end - ISO date string for slot end time
 * @returns {boolean} True if there is a scheduling conflict, false otherwise
 */

export function getAppointmentConflict(
  selectedDate,
  upcomingAppointments,
  availableSlots,
) {
  let hasConflict = false;
  if (selectedDate && availableSlots) {
    const selectedSlot = availableSlots?.find(
      slot => slot.start === selectedDate,
    );
    if (selectedSlot) {
      const selectedSlotStart = ensureDate(selectedSlot.start);
      const selectedSlotEnd = ensureDate(selectedSlot.end);
      const key = format(selectedSlotStart, DATE_FORMATS.yearMonth);
      const appointments = upcomingAppointments[key];
      hasConflict = appointments?.some(appointment => {
        // Use UTC timestamps for conflict detection. This avoids timezone conversion issues.
        const slotInterval = {
          start: selectedSlotStart,
          end: selectedSlotEnd,
        };
        const appointmentInterval = {
          start: ensureDate(appointment.start),
          end: addMinutes(
            ensureDate(appointment.start),
            appointment.minutesDuration,
          ),
        };
        return (
          appointment.status !== APPOINTMENT_STATUS.cancelled &&
          areIntervalsOverlapping(slotInterval, appointmentInterval)
        );
      });
    }
  }
  return hasConflict;
}

/**
 * @const {number} DEFAULT_MAX_DAYS_AHEAD
 * @default 90
 */
const DEFAULT_MAX_DAYS_AHEAD = 90;

/**
 * Pads single digit number with zero
 *
 * @param {number} num A given number
 * @param {number} size A given size
 * @returns {string} A string e.g. 03
 */
export function pad(num, size) {
  let s = num.toString();
  while (s.length < size) s = `0${s}`;
  return s;
}

/**
 * Gets the first day of the month
 *
 * @param {Date} date A given date
 * @returns {number} A number of the first day of the month
 */
export function getFirstDayOfMonth(date) {
  return Number(format(startOfMonth(date), 'i'));
}

/**
 * Gets the maximum month based on inputs
 *
 * @param {Date} maxDate
 * @returns {Date}
 */
export function getMaxMonth(maxDate, overrideMaxDays) {
  const defaultMaxMonth = addDays(new Date(), DEFAULT_MAX_DAYS_AHEAD);

  if ((maxDate && isAfter(maxDate, defaultMaxMonth)) || overrideMaxDays) {
    return maxDate;
  }
  // If no available dates array provided, set max to default from now
  return defaultMaxMonth;
}

/**
 * Gets the initial blank cells
 *
 * @param {Date} date A given date
 * @param {boolean} [showWeekends] Whether to show full weekend slots or not
 * @returns {Array} Array of blanks to push start day position
 */
export function getInitialBlankCells(date, showWeekends) {
  const firstDay = getFirstDayOfMonth(date);
  const blanks = [];

  if (!showWeekends && (firstDay === 0 || firstDay === 6)) {
    return blanks;
  }

  const weekStart = showWeekends ? 0 : 1;
  for (let i = weekStart; i < firstDay; i++) {
    blanks.push(null);
  }

  return blanks;
}

/**
 * Gets the days of the week
 *
 * @param {Date} date A given date
 * @param {boolean} [showWeekend] Whether to show full weekend slots or not
 * @returns {Array} Array of days
 */
export function getDaysOfTheWeek(date, showWeekend) {
  const daysToShow = [];
  let dayOfWeek;

  if (!showWeekend) {
    dayOfWeek = getFirstDayOfMonth(date);
  }

  /**
   * Create array of days of the week. If the showing the weekend, don't check
   * for Sunday (0) or Saturday (6)
   */
  for (let i = 1; i <= getDaysInMonth(date); i++) {
    if (showWeekend) {
      daysToShow.push(
        `${format(date, 'yyyy')}-${format(date, 'MM')}-${pad(i, 2)}`,
      );
    } else {
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysToShow.push(
          `${format(date, 'yyyy')}-${format(date, 'MM')}-${pad(i, 2)}`,
        );
      }
      dayOfWeek = dayOfWeek + 1 > 6 ? 0 : dayOfWeek + 1;
    }
  }
  return daysToShow;
}

/**
 * Gets cells for days of a week
 *
 * @param {Date} date A given date
 * @param {boolean} [showWeekend] Whether to show full weekend slots or not
 * @returns {Array} Array of cells
 */
export function getCells(date, showWeekend) {
  const cells = [...getInitialBlankCells(date, showWeekend)];
  const daysToShow = showWeekend ? 7 : 5;

  cells.push(...getDaysOfTheWeek(date, showWeekend));

  // Add blank cells to end of month
  while (cells.length % daysToShow !== 0) cells.push(null);

  return cells;
}

/**
 * Parses calendar weeks and returns array
 *
 * @param {Date} date A given date
 * @param {boolean} [showWeekend] Whether to show full weekend slots or not
 * @returns {Array} Array of weeks
 */
export function getCalendarWeeks(date, showWeekend) {
  const dateCells = getCells(date, showWeekend);
  const weeks = [];
  const daysToShow = showWeekend ? 7 : 5;
  let currentWeek = [];

  for (let index = 0; index < dateCells.length; index++) {
    if (index > 0 && index % daysToShow === 0) {
      weeks.push(currentWeek);
      currentWeek = [dateCells[index]];
    } else {
      currentWeek.push(dateCells[index]);
    }
  }
  weeks.push(currentWeek);
  return weeks;
}

/**
 * Click event handler for previous calendar entries
 *
 * @param {Function} onClickPrev Given function when clicking previous button
 * on calendar
 * @param {Array} dates Given dates array
 * @param {Function} setDates Given dates array
 */
export function handlePrev(onClickPrev, dates, setDates) {
  const updatedMonths = dates.map(date => subMonths(date, 1));

  if (onClickPrev) {
    onClickPrev(
      format(updatedMonths[0], 'yyyy-MM-dd'),
      format(endOfMonth(updatedMonths[updatedMonths.length - 1]), 'yyyy-MM-dd'),
    );
  }
  setDates(updatedMonths);
}

/**
 * Handle Next Function
 *
 * @param {Function} onClickNext Given function when clicking next button
 * on calendar
 * @param {Array} dates Given dates array
 * @param {Function} setDates dates to set array
 */
export function handleNext(onClickNext, dates, setDates) {
  const updatedMonths = dates.map(date => startOfMonth(addMonths(date, 1)));

  if (onClickNext) {
    onClickNext(
      format(updatedMonths[0], 'yyyy-MM-dd'),
      format(endOfMonth(updatedMonths[updatedMonths.length - 1]), 'yyyy-MM-dd'),
    );
  }
  setDates(updatedMonths);
}
