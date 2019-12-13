import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import CalendarOptions from './CalendarOptions';

const CalendarCell = ({
  date,
  currentlySelectedDate,
  inSelectedArray,
  disabled,
  onClick,
  index,
  additionalOptions,
  selectedDates,
  handleSelectOption,
  optionsError,
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
    <>
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
            <i className="fas fa-check vads-u-color--white" />
          )}
          {dateDay}
          {isCurrentlySelected && (
            <span className="vaos-calendar__cell-selected-triangle" />
          )}
        </button>
      </div>
      {isCurrentlySelected && (
        <CalendarOptions
          selectedCellIndex={index}
          currentlySelectedDate={currentlySelectedDate}
          additionalOptions={additionalOptions}
          handleSelectOption={handleSelectOption}
          optionsError={optionsError}
          selectedDates={selectedDates}
        />
      )}
    </>
  );
};

export default CalendarCell;
