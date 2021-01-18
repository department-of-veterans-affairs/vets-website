import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import CalendarRow from './CalendarRow';
import CalendarNavigation from './CalendarNavigation';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';
import { FETCH_STATUS } from '../../utils/constants';

const DEFAULT_MAX_DAYS_AHEAD = 90;

function pad(num, size) {
  let s = num.toString();
  while (s.length < size) s = `0${s}`;
  return s;
}

function getWeekdayOfFirstOfMonth(momentDate) {
  return momentDate.startOf('month').format('d');
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

function getWeekdays(momentDate) {
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

export default function CalendarWidget({
  additionalOptions,
  availableSlots,
  id,
  loadingErrorMessage,
  loadingStatus,
  maxDate,
  maxSelections = 1,
  minDate,
  onChange,
  onClickNext,
  onClickPrev,
  renderOptions,
  selectedIndicatorType,
  startMonth,
  timezone,
  validationError,
  value = [],
}) {
  const [currentlySelectedDate, setCurrentlySelectedDate] = useState(() => {
    if (value.length > 0) {
      return value[0].split('T')[0];
    }

    return null;
  });
  const currentDate = moment();
  const maxMonth = getMaxMonth(maxDate, startMonth);
  const [months, setMonths] = useState([moment(startMonth || minDate)]);

  const showError = validationError?.length > 0;

  const calendarCss = classNames('vaos-calendar__calendars vads-u-flex--1', {
    'vaos-calendar__loading': loadingStatus === FETCH_STATUS.loading,
    'usa-input-error': showError,
  });

  if (loadingStatus === FETCH_STATUS.failed) {
    return loadingErrorMessage;
  }
  // declare const from renderMonth here
  const nextMonthToDisplay = months[months.length - 1]
    ?.clone()
    .add(1, 'months')
    .format('YYYY-MM');

  const prevDisabled =
    months[0].format('YYYY-MM') <= currentDate.format('YYYY-MM');
  const nextDisabled = nextMonthToDisplay > maxMonth;
  return (
    <div className="vaos-calendar vads-u-margin-top--4 vads-u-display--flex">
      {(loadingStatus === FETCH_STATUS.loading ||
        loadingStatus === FETCH_STATUS.notStarted) && (
        <div className="vaos-calendar__loading-overlay">
          <LoadingIndicator message="Finding appointment availability..." />
        </div>
      )}
      <div className={calendarCss}>
        {showError && (
          <span
            className="vaos-calendar__validation-msg usa-input-error-message"
            role="alert"
          >
            {validationError}
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
                        handlePrev(onClickPrev, months, setMonths)
                      }
                      nextOnClick={() =>
                        handleNext(onClickNext, months, setMonths)
                      }
                      momentMonth={month}
                      prevDisabled={prevDisabled}
                      nextDisabled={nextDisabled}
                    />
                  )}
                  <hr aria-hidden="true" className="vads-u-margin-y--1" />
                  <CalendarWeekdayHeader />
                  <div role="rowgroup">
                    {/* replace renderWeeks function here */}
                    {getCalendarWeeks(month).map((week, weekIndex) => (
                      <CalendarRow
                        additionalOptions={additionalOptions}
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
                            onChange([date]);
                          }
                        }}
                        hasError={validationError?.length > 0}
                        key={`row-${weekIndex}`}
                        maxDate={maxDate}
                        maxSelections={maxSelections}
                        minDate={minDate}
                        rowNumber={weekIndex}
                        selectedDates={value}
                        selectedIndicatorType={selectedIndicatorType}
                        renderOptions={renderOptions}
                      />
                    ))}
                  </div>
                </>
              </div>
            ) : null,
        )}
      </div>
    </div>
  );
}

CalendarWidget.propTypes = {
  additionalOptions: PropTypes.object,
  availableSlots: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string,
    }),
  ),
  loadingStatus: PropTypes.string,
  minDate: PropTypes.string, // YYYY-MM-DD
  maxDate: PropTypes.string, // YYYY-MM-DD
  maxSelections: PropTypes.number,
  startMonth: PropTypes.string, // YYYY-MM
  onChange: PropTypes.func,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  validationError: PropTypes.string,
  renderOptions: PropTypes.func,
  id: PropTypes.string.isRequired,
  timezone: PropTypes.string, // America/Denver
};
