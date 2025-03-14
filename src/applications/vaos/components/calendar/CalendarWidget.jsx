/**
 * Shared calendar widget component used by the VAOS application.
 * @module components/calendar
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

import CalendarNavigation from './CalendarNavigation';
import CalendarRow from './CalendarRow';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';
import { CalendarContext } from './CalendarContext';

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
 * @param {Moment} momentDate A given moment date
 * @returns {number} A number of the first day of the month
 */
function getFirstDayOfMonth(momentDate) {
  return Number(momentDate.startOf('month').format('d'));
}

/**
 * Gets the maximum month based on inputs
 *
 * @param {string} maxDate YYYY-DD-MM
 * @returns {string} YYYY-MM
 */
export function getMaxMonth(maxDate, overrideMaxDays) {
  const defaultMaxMonth = moment()
    .add(DEFAULT_MAX_DAYS_AHEAD, 'days')
    .format('YYYY-MM');
  const maxMonth = moment(maxDate).startOf('month');

  if (maxDate && (maxMonth.isAfter(defaultMaxMonth) || overrideMaxDays)) {
    return maxMonth.format('YYYY-MM');
  }
  // If no available dates array provided, set max to default from now
  return defaultMaxMonth;
}

/**
 * Gets the initial blank cells
 *
 * @param {Moment} momentDate A given moment date
 * @param {boolean} [showWeekends] Whether to show full weekend slots or not
 * @returns {Array} Array of blanks to push start day position
 */
function getInitialBlankCells(momentDate, showWeekends) {
  const firstDay = getFirstDayOfMonth(momentDate);
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
 * @param {Moment} momentDate A given moment date
 * @param {boolean} [showWeekend] Whether to show full weekend slots or not
 * @returns {Array} Array of days
 */
function getDaysOfTheWeek(momentDate, showWeekend) {
  const daysToShow = [];
  let dayOfWeek;

  if (!showWeekend) {
    dayOfWeek = getFirstDayOfMonth(momentDate);
  }

  /**
   * Create array of days of the week. If the showing the weekend, don't check
   * for Sunday (0) or Saturday (6)
   */
  for (let i = 1; i <= momentDate.daysInMonth(); i++) {
    if (showWeekend) {
      daysToShow.push(
        `${momentDate.format('YYYY')}-${momentDate.format('MM')}-${pad(i, 2)}`,
      );
    } else {
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysToShow.push(
          `${momentDate.format('YYYY')}-${momentDate.format('MM')}-${pad(
            i,
            2,
          )}`,
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
 * @param {Moment} momentDate A given moment date
 * @param {boolean} [showWeekend] Whether to show full weekend slots or not
 * @returns {Array} Array of cells
 */
function getCells(momentDate, showWeekend) {
  const cells = [...getInitialBlankCells(momentDate, showWeekend)];
  const daysToShow = showWeekend ? 7 : 5;

  cells.push(...getDaysOfTheWeek(momentDate, showWeekend));

  // Add blank cells to end of month
  while (cells.length % daysToShow !== 0) cells.push(null);

  return cells;
}

/**
 * Parses calendar weeks and returns array
 *
 * @param {Moment} momentDate A given moment date
 * @param {boolean} [showWeekend] Whether to show full weekend slots or not
 * @returns {Array} Array of weeks
 */
export function getCalendarWeeks(momentDate, showWeekend) {
  const dateCells = getCells(momentDate, showWeekend);
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
 * @param {Array} months Given months array
 * @param {Function} setMonths Given months array
 */
function handlePrev(onClickPrev, months, setMonths) {
  const updatedMonths = months.map(m => m.subtract(1, 'months'));

  if (onClickPrev) {
    onClickPrev(
      updatedMonths[0].format('YYYY-MM-DD'),
      updatedMonths[updatedMonths.length - 1]
        .endOf('month')
        .format('YYYY-MM-DD'),
    );
  }
  setMonths(updatedMonths);
}

/**
 * Handle Next Function
 *
 * @param {Function} onClickNext Given function when clicking next button
 * on calendar
 * @param {Array} months Given months array
 * @param {Function} setMonths Months to set array
 */
function handleNext(onClickNext, months, setMonths) {
  const updatedMonths = months.map(m => m.add(1, 'months'));

  if (onClickNext) {
    onClickNext(
      updatedMonths[0].format('YYYY-MM-DD'),
      updatedMonths[updatedMonths.length - 1]
        .endOf('month')
        .format('YYYY-MM-DD'),
    );
  }
  setMonths(updatedMonths);
}

/**
 * Calendar widget
 *
 * @param {Object} props
 * @param {Array<Slot>} props.availableSlots
 * @param {string} props.id
 * @param {boolean} props.disabled
 * @param {string} props.disabledMessage
 * @param {string} props.maxDate YYYY-MM-DD
 * @param {number} props.maxSelections
 * @param {string} props.maxSelectionsError
 * @param {string} props.minDate YYYY-MM-DD
 * @param {Function} props.onChange
 * @param {Function} props.onNextMonth
 * @param {Function} props.onPreviousMonth
 * @param {Function} props.renderOptions
 * @param {Function} props.renderIndicator
 * @param {Function} props.renderSelectedLabel
 * @param {boolean} props.required
 * @param {string} props.requiredMessage
 * @param {boolean} props.showValidation
 * @param {string} props.startMonth YYYY-MM
 * @param {string} props.timezone America/Denver
 * @param {Array<string>} props.value
 * @param {boolean} [props.showWeekends=false] Whether to show full weekend slots or not
 * @param {boolean} [props.overrideMaxDays=false] Disables the default max days value
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
  startMonth,
  timezone,
  value = [],
  showWeekends = false,
  upcomingAppointments = [],
  isAppointmentSelectionError,
}) {
  const [currentlySelectedDate, setCurrentlySelectedDate] = useState(() => {
    if (value.length > 0) {
      return value[0].split('T')[0];
    }

    return null;
  });
  const currentDate = moment();
  const maxMonth = getMaxMonth(maxDate, overrideMaxDays);
  const [months, setMonths] = useState([moment(startMonth || minDate)]);
  const exceededMaximumSelections = value.length > maxSelections;
  const hasError = (required && showValidation) || exceededMaximumSelections;

  const calendarCss = classNames('vaos-calendar__calendars vads-u-flex--1', {
    'vaos-calendar__disabled': disabled,
    'usa-input-error': hasError,
  });

  // declare const from renderMonth here
  const nextMonthToDisplay = months[months.length - 1]
    ?.clone()
    .add(1, 'months')
    .format('YYYY-MM');

  const prevDisabled =
    disabled || months[0].format('YYYY-MM') <= currentDate.format('YYYY-MM');
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
        <div className={calendarCss}>
          {hasError && (
            <span
              className="vaos-calendar__validation-msg usa-input-error-message"
              role="alert"
            >
              {showValidation && requiredMessage}
              {exceededMaximumSelections && maxSelectionsError}
            </span>
          )}
          {months.map(
            (month, index) =>
              month.format('YYYY-MM') <= maxMonth ? (
                <div
                  key={`month-${index}`}
                  className="vaos-calendar__container vads-u-margin-bottom--3"
                  aria-labelledby={`h2-${month.format('YYYY-MM')}`}
                  role="table"
                >
                  <>
                    {index === 0 && (
                      <CalendarNavigation
                        prevOnClick={() =>
                          handlePrev(onPreviousMonth, months, setMonths)
                        }
                        nextOnClick={() =>
                          handleNext(onNextMonth, months, setMonths)
                        }
                        momentMonth={month}
                        prevDisabled={prevDisabled}
                        nextDisabled={nextDisabled}
                      />
                    )}
                    <hr aria-hidden="true" className="vads-u-margin-y--1" />
                    <CalendarWeekdayHeader showFullWeek={showWeekends} />
                    <div role="rowgroup">
                      {getCalendarWeeks(month, showWeekends).map(
                        (week, weekIndex) => (
                          <CalendarRow
                            availableSlots={availableSlots}
                            cells={week}
                            id={id}
                            timezone={timezone}
                            currentlySelectedDate={currentlySelectedDate}
                            handleSelectDate={date => {
                              if (
                                maxSelections === 1 &&
                                date === currentlySelectedDate
                              ) {
                                onChange([]);
                              }

                              setCurrentlySelectedDate(
                                date === currentlySelectedDate ? null : date,
                              );
                            }}
                            handleSelectOption={date => {
                              if (maxSelections > 1) {
                                if (value.includes(date)) {
                                  onChange(
                                    value.filter(
                                      selectedDate => selectedDate !== date,
                                    ),
                                  );
                                } else {
                                  onChange(value.concat(date));
                                }
                              } else {
                                onChange(
                                  [date],
                                  maxSelections,
                                  upcomingAppointments,
                                );
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
  isAppointmentSelectionError: PropTypes.bool,
  maxDate: PropTypes.string,
  maxSelections: PropTypes.number,
  maxSelectionsError: PropTypes.string,
  minDate: PropTypes.string,
  overrideMaxDays: PropTypes.bool,
  renderIndicator: PropTypes.func,
  renderOptions: PropTypes.func,
  renderSelectedLabel: PropTypes.func,
  required: PropTypes.bool,
  requiredMessage: PropTypes.string,
  showValidation: PropTypes.bool,
  showWeekends: PropTypes.bool,
  startMonth: PropTypes.string,
  timezone: PropTypes.string,
  upcomingAppointments: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onNextMonth: PropTypes.func,
  onPreviousMonth: PropTypes.func,
};

export default CalendarWidget;
