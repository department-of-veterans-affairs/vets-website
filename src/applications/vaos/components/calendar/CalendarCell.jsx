import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import CalendarOptions from './CalendarOptions';
import CalendarSelectedIndicator from './CalendarSelectedIndicator';

const CalendarCell = ({
  additionalOptions,
  currentlySelectedDate,
  date,
  disabled,
  handleSelectOption,
  index,
  inSelectedArray,
  onClick,
  optionsError,
  selectedDates,
  selectedIndicatorType,
}) => {
  if (date === null) {
    return (
      <div role="cell" className="vaos-calendar__calendar-day">
        <button className=" vads-u-visibility--hidden" />
      </div>
    );
  }

  const isCurrentlySelected = currentlySelectedDate === date;
  const momentDate = moment(date);
  const dateDay = momentDate.format('D');
  const ariaDate = momentDate.format('dddd, MMMM Do');

  const cssClasses = classNames('vaos-calendar__calendar-day', {
    'vaos-calendar__cell-current': isCurrentlySelected,
    'vaos-calendar__cell-selected': inSelectedArray,
  });

  return (
    <div role="cell" className={cssClasses}>
      <button
        id={`date-cell-${date}`}
        onClick={() => onClick(date)}
        disabled={disabled}
        aria-label={ariaDate}
        aria-expanded={isCurrentlySelected}
        type="button"
      >
        {inSelectedArray && (
          <CalendarSelectedIndicator
            date={date}
            fieldName={additionalOptions?.fieldName}
            selectedDates={selectedDates}
            selectedIndicatorType={selectedIndicatorType}
          />
        )}
        {dateDay}
        {isCurrentlySelected && (
          <span className="vaos-calendar__cell-selected-triangle" />
        )}
      </button>
      <CalendarOptions
        isCurrentlySelected={isCurrentlySelected}
        selectedCellIndex={index}
        currentlySelectedDate={date}
        additionalOptions={additionalOptions}
        handleSelectOption={handleSelectOption}
        optionsError={optionsError}
        selectedDates={selectedDates}
      />
    </div>
  );
};

export default CalendarCell;
