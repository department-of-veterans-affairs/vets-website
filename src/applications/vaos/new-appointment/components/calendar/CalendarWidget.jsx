import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import CalendarRow from './CalendarRow';
import CalendarNavigation from './CalendarNavigation';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';
import {
  isDateInSelectedArray,
  isDateOptionPairInSelectedArray,
} from './dateHelpers';
import { FETCH_STATUS } from '../../../utils/constants';

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

function handlePrev(onClickPrev, monthsToShowAtOnce, months, setMonths) {
  const updatedMonths = months.map(m =>
    m.subtract(monthsToShowAtOnce, 'months'),
  );

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
  const updatedMonths = months.map(m =>
    m.add(this.props.monthsToShowAtOnce, 'months'),
  );

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

function handleMultiSelect(
  date,
  onChange,
  selectedDates,
  additionalOptions,
  currentlySelectedDate,
) {
  const updatedSelectedDates = selectedDates ? [...selectedDates] : [];

  const isInSelectedArray = isDateInSelectedArray(date, updatedSelectedDates);
  // If an option selection is required, don't add this date to selectedDates
  // array until an option is selected as well
  if (!isInSelectedArray && !additionalOptions?.required) {
    updatedSelectedDates.push({ date });
  }

  onChange({
    currentlySelectedDate: currentlySelectedDate === date ? null : date,
    updatedSelectedDates,
  });
}

function handleSelectDate(
  date,
  selectedDates,
  currentlySelectedDate,
  additionalOptions,
  maxSelections,
  onChange,
) {
  let updatedSelectedDates = selectedDates ? [...selectedDates] : [];
  let updatedCurrentlySelectedDate = currentlySelectedDate;

  if (maxSelections > 1) {
    handleMultiSelect(date);
  } else {
    if (date !== currentlySelectedDate) {
      if (!additionalOptions?.required) {
        updatedSelectedDates = [{ date }];
      }
      updatedCurrentlySelectedDate = date;
    } else {
      updatedSelectedDates = selectedDates.filter(d => d.date !== date);
      updatedCurrentlySelectedDate = null;
    }
    onChange({
      updatedCurrentlySelectedDate,
      updatedSelectedDates,
    });
  }
}

function handleSelectOption(
  dateObj,
  selectedDates,
  additionalOptions,
  onChange,
  currentlySelectedDate,
) {
  let updatedSelectedDates = [...selectedDates];

  const maxOptionSelections = additionalOptions.maxSelections;
  const fieldName = additionalOptions.fieldName;
  const alreadySelected = isDateOptionPairInSelectedArray(
    dateObj,
    selectedDates,
    fieldName,
  );
  if (maxOptionSelections > 1) {
    if (alreadySelected) {
      updatedSelectedDates = removeDateOptionPairFromSelectedArray(
        dateObj,
        selectedDates,
        fieldName,
      );
    } else {
      updatedSelectedDates.push(dateObj);
    }
  } else {
    updatedSelectedDates = [dateObj];
  }
  onChange({
    currentlySelectedDate,
    updatedSelectedDates,
  });
}

function renderWeeks({
  month,
  additionalOptions,
  availableDates,
  currentlySelectedDate,
  maxDate,
  maxSelections,
  minDate,
  onChange,
  selectedDates,
  selectedIndicatorType,
  validationError,
}) {
  return getCalendarWeeks(month).map((week, index) => (
    <CalendarRow
      additionalOptions={additionalOptions}
      availableDates={availableDates}
      cells={week}
      currentlySelectedDate={currentlySelectedDate}
      handleSelectDate={() => handleSelectDate(onChange)}
      handleSelectOption={handleSelectOption}
      hasError={validationError?.length > 0}
      key={`row-${index}`}
      maxDate={maxDate}
      maxSelections={maxSelections}
      minDate={minDate}
      rowNumber={index}
      selectedDates={selectedDates || []}
      selectedIndicatorType={selectedIndicatorType}
    />
  ));
}

function renderMonth({
  additionalOptions,
  availableDates,
  currentDate,
  currentlySelectedDate,
  index,
  maxDate,
  maxMonth,
  maxSelections,
  minDate,
  month,
  months,
  monthsToShowAtOnce,
  onChange,
  onClickNext,
  onClickPrev,
  selectedDates,
  selectedIndicatorType,
  setMonths,
  validationError,
}) {
  const nextMonthToDisplay = months[months.length - 1]
    ?.clone()
    .add(1, 'months')
    .format('YYYY-MM');

  const prevDisabled =
    months[0].format('YYYY-MM') <= currentDate.format('YYYY-MM');
  const nextDisabled = nextMonthToDisplay > maxMonth;

  return (
    <>
      <h2
        id={`h2-${month.format('YYYY-MM')}`}
        className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0 vads-u-display--block vads-u-font-family--serif"
      >
        {month.format('MMMM YYYY')}
      </h2>
      <div
        className="sr-only"
        id={`vaos-calendar-instructions-${month.month()}`}
      >
        Press the Enter key to expand the day you want to schedule an
        appointment. Then press the Tab key or form shortcut key to select an
        appointment time.
      </div>

      {index === 0 && (
        <CalendarNavigation
          prevOnClick={() =>
            handlePrev(onClickPrev, monthsToShowAtOnce, months, setMonths)
          }
          nextOnClick={() => handleNext(onClickNext, months, setMonths)}
          prevDisabled={prevDisabled}
          nextDisabled={nextDisabled}
        />
      )}
      <hr aria-hidden="true" className="vads-u-margin-y--1" />
      <CalendarWeekdayHeader />
      <div role="rowgroup">
        {() =>
          renderWeeks({
            month,
            additionalOptions,
            availableDates,
            currentlySelectedDate,
            maxDate,
            maxSelections,
            minDate,
            onChange,
            selectedDates,
            selectedIndicatorType,
            validationError,
          })
        }
      </div>
    </>
  );
}

export default function CalendarWidget({
  additionalOptions,
  availableDates,
  currentlySelectedDate,
  loadingErrorMessage,
  loadingStatus,
  maxDate,
  maxSelections = 1,
  minDate,
  monthsToShowAtOnce = 1,
  onChange,
  onClickNext,
  onClickPrev,
  selectedDates,
  selectedIndicatorType,
  startMonth,
  validationError,
}) {
  const currentDate = moment();
  const maxMonth = getMaxMonth(maxDate, startMonth);
  const [months, setMonths] = useState([currentDate]);

  useEffect(
    () => {
      // Updates months to show at once if > default setting
      if (monthsToShowAtOnce > months.length) {
        const updatedMonths = [];
        const startDate = startMonth ? moment(startMonth) : moment();

        for (let index = 0; index < monthsToShowAtOnce; index++) {
          months.push(startDate.clone().add(index, 'months'));
        }
        setMonths(updatedMonths);
      }
    },
    [months, monthsToShowAtOnce, startMonth],
  );

  const showError = validationError?.length > 0;

  const calendarCss = classNames('vaos-calendar__calendars vads-u-flex--1', {
    'vaos-calendar__loading': loadingStatus === FETCH_STATUS.loading,
    'usa-input-error': showError,
  });

  if (loadingStatus === FETCH_STATUS.failed) {
    return loadingErrorMessage;
  }

  return (
    <div className="vaos-calendar vads-u-margin-top--4 vads-u-display--flex">
      {loadingStatus === FETCH_STATUS.loading && (
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
                {renderMonth({
                  additionalOptions,
                  availableDates,
                  currentDate,
                  currentlySelectedDate,
                  index,
                  maxDate,
                  maxMonth,
                  maxSelections,
                  minDate,
                  month,
                  months,
                  monthsToShowAtOnce,
                  onChange,
                  onClickNext,
                  onClickPrev,
                  selectedDates,
                  selectedIndicatorType,
                  setMonths,
                  validationError,
                })}
              </div>
            ) : null,
        )}
      </div>
    </div>
  );
}

CalendarWidget.propTypes = {
  additionalOptions: PropTypes.object,
  availableDates: PropTypes.array, // ['YYYY-MM-DD']
  loadingStatus: PropTypes.string,
  minDate: PropTypes.string, // YYYY-MM-DD
  maxDate: PropTypes.string, // YYYY-MM-DD
  maxSelections: PropTypes.number,
  monthsToShowAtOnce: PropTypes.number,
  startMonth: PropTypes.string, // YYYY-MM
  onChange: PropTypes.func,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  validationError: PropTypes.string,
};
