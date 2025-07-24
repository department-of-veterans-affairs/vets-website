/**
 * Shared calendar widget component used by the VAOS application.
 * @module components/calendar
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDaysInMonth,
  isAfter,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { getAppointmentConflict } from '../../utils/appointment';
import { CalendarContext } from './CalendarContext';
import CalendarNavigation from './CalendarNavigation';
import CalendarRow from './CalendarRow';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';

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
function pad(num, size) {
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
function getFirstDayOfMonth(date) {
  return Number(format(startOfMonth(date), 'd'));
}

/**
 * Gets the maximum month based on inputs
 *
 * @param {Date} maxDate
 * @returns {Date}
 */
function getMaxMonth(maxDate, overrideMaxDays) {
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
function getInitialBlankCells(date, showWeekends) {
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
function getDaysOfTheWeek(date, showWeekend) {
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
function getCells(date, showWeekend) {
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
function getCalendarWeeks(date, showWeekend) {
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
function handlePrev(onClickPrev, dates, setDates) {
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
function handleNext(onClickNext, dates, setDates) {
  const updatedMonths = dates.map(date => startOfMonth(addMonths(date, 1)));

  if (onClickNext) {
    onClickNext(
      format(updatedMonths[0], 'yyyy-MM-dd'),
      format(endOfMonth(updatedMonths[updatedMonths.length - 1]), 'yyyy-MM-dd'),
    );
  }
  setDates(updatedMonths);
}

/**
 * Calendar widget
 *
 * @param {Object} props
 * @param {Array<Slot>} props.availableSlots
 * @param {string} props.id
 * @param {boolean} props.disabled
 * @param {string} props.disabledMessage
 * @param {Date} props.maxDate
 * @param {number} props.maxSelections
 * @param {string} props.maxSelectionsError
 * @param {Date} props.minDate
 * @param {Function} props.onChange
 * @param {Function} props.onNextMonth
 * @param {Function} props.onPreviousMonth
 * @param {Function} props.renderOptions
 * @param {Function} props.renderIndicator
 * @param {Function} props.renderSelectedLabel
 * @param {boolean} props.required
 * @param {string} props.requiredMessage
 * @param {boolean} props.showValidation
 * @param {Date} props.startMonth
 * @param {string} props.timezone America/Denver
 * @param {Array<string>} props.value
 * @param {boolean} [props.showWeekends=false] Whether to show full weekend slots or not
 * @param {boolean} [props.overrideMaxDays=false] Disables the default max days value
 * @param {boolean} [props.hideWhileDisabled=false] Whether to show the calendar while disabled
 * @returns {JSX.Element} props.Calendar Calendar Widget
 */
function CalendarWidget({
  appointmentSelectionErrorMsg = 'You already have an appointment scheduled at this time. Please select another day or time.',
  availableSlots,
  id,
  disabled,
  disabledMessage,
  maxDate,
  maxSelections = 1,
  maxSelectionsError = "You've exceeded the maximum number of selections",
  minDate,
  onChange,
  onNextMonth,
  onPreviousMonth,
  overrideMaxDays = false,
  renderOptions,
  renderIndicator,
  renderSelectedLabel,
  required,
  requiredMessage = 'Please select a date',
  showValidation,
  startMonth: startDate,
  timezone,
  value = [],
  showWeekends = false,
  upcomingAppointments = [],
  isAppointmentSelectionError,
  hideWhileDisabled = false,
}) {
  const [currentlySelectedDate, setCurrentlySelectedDate] = useState(() => {
    if (value.length > 0) {
      return value[0].split('T')[0];
    }

    return null;
  });
  const currentDate = new Date();
  const maxMonth = getMaxMonth(maxDate, overrideMaxDays);
  const [dates, setDates] = useState([startDate || minDate]);
  const exceededMaximumSelections = value.length > maxSelections;
  const hasError = (required && showValidation) || exceededMaximumSelections;

  // Undefined allows to unset aria-hidden
  const hideCalendar = (disabled && hideWhileDisabled) || undefined;
  const calendarCss = classNames('vaos-calendar__calendars vads-u-flex--1', {
    'vaos-calendar__disabled': disabled,
    'usa-input-error': hasError,
    'vads-u-visibility--hidden': hideCalendar,
  });

  // declare const from renderMonth here
  const nextMonthToDisplay = startOfMonth(
    addMonths(dates[dates.length - 1], 1),
  );

  const prevDisabled =
    disabled || startOfDay(dates[0]) <= startOfDay(currentDate);
  const nextDisabled = disabled || nextMonthToDisplay > maxMonth;

  return (
    <CalendarContext.Provider
      value={{
        isAppointmentSelectionError,
        appointmentSelectionErrorMsg,
      }}
    >
      <div className="vaos-calendar vads-u-margin-top--4 vads-u-display--flex">
        {disabled && (
          <div className="vaos-calendar__disabled-overlay">
            {disabledMessage}
          </div>
        )}
        <div
          data-testid="vaos-calendar"
          className={calendarCss}
          aria-hidden={hideCalendar}
        >
          {hasError && (
            <span
              className="vaos-calendar__validation-msg usa-input-error-message vaos-input-error-message"
              role="alert"
            >
              {showValidation && requiredMessage}
              {exceededMaximumSelections && maxSelectionsError}
            </span>
          )}
          {dates.map(
            (date, index) =>
              date <= maxMonth ? (
                <div
                  key={`month-${index}`}
                  className="vaos-calendar__container vads-u-margin-bottom--3"
                  aria-labelledby={`h2-${format(date, 'yyyy-MM')}`}
                  role="table"
                >
                  <>
                    {index === 0 && (
                      <CalendarNavigation
                        prevOnClick={() =>
                          handlePrev(onPreviousMonth, dates, setDates)
                        }
                        nextOnClick={() =>
                          handleNext(onNextMonth, dates, setDates)
                        }
                        date={date}
                        prevDisabled={prevDisabled}
                        nextDisabled={nextDisabled}
                      />
                    )}
                    <hr aria-hidden="true" className="vads-u-margin-y--1" />
                    <CalendarWeekdayHeader showFullWeek={showWeekends} />
                    <div role="rowgroup">
                      {getCalendarWeeks(date, showWeekends).map(
                        (week, weekIndex) => (
                          <CalendarRow
                            availableSlots={availableSlots}
                            cells={week}
                            id={id}
                            timezone={timezone}
                            currentlySelectedDate={currentlySelectedDate}
                            handleSelectDate={dateSelection => {
                              if (maxSelections === 1) {
                                onChange([]);
                              }

                              setCurrentlySelectedDate(
                                dateSelection === currentlySelectedDate
                                  ? null
                                  : dateSelection,
                              );
                            }}
                            handleSelectOption={aDate => {
                              if (maxSelections > 1) {
                                if (value.includes(aDate)) {
                                  onChange(
                                    value.filter(
                                      selectedDate => selectedDate !== aDate,
                                    ),
                                  );
                                } else {
                                  onChange(value.concat(aDate));
                                }
                              } else {
                                const hasConflict = getAppointmentConflict(
                                  aDate,
                                  upcomingAppointments,
                                  availableSlots,
                                );
                                onChange([aDate], hasConflict);
                              }
                            }}
                            hasError={hasError}
                            key={`row-${weekIndex}`}
                            maxDate={maxDate}
                            maxSelections={maxSelections}
                            minDate={minDate}
                            rowNumber={weekIndex}
                            selectedDates={value}
                            renderIndicator={renderIndicator}
                            renderOptions={renderOptions}
                            renderSelectedLabel={renderSelectedLabel}
                            disabled={disabled}
                            showWeekends={showWeekends}
                          />
                        ),
                      )}
                    </div>
                  </>
                </div>
              ) : null,
          )}
        </div>
      </div>
    </CalendarContext.Provider>
  );
}

CalendarWidget.propTypes = {
  id: PropTypes.string.isRequired,
  appointmentSelectionErrorMsg: PropTypes.string,
  availableSlots: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string,
    }),
  ),
  disabled: PropTypes.bool,
  disabledMessage: PropTypes.object,
  hideWhileDisabled: PropTypes.bool,
  isAppointmentSelectionError: PropTypes.bool,
  maxDate: PropTypes.instanceOf(Date),
  maxSelections: PropTypes.number,
  maxSelectionsError: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  overrideMaxDays: PropTypes.bool,
  renderIndicator: PropTypes.func,
  renderOptions: PropTypes.func,
  renderSelectedLabel: PropTypes.func,
  required: PropTypes.bool,
  requiredMessage: PropTypes.string,
  showValidation: PropTypes.bool,
  showWeekends: PropTypes.bool,
  startMonth: PropTypes.instanceOf(Date),
  timezone: PropTypes.string,
  upcomingAppointments: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onNextMonth: PropTypes.func,
  onPreviousMonth: PropTypes.func,
};

export default CalendarWidget;
