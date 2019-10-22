import React from 'react';
import moment from 'moment';

const CalendarCell = ({
  date,
  isCurrentlySelected,
  inSelectedArray,
  disabled,
  onClick,
}) => {
  if (date === null) {
    return (
      <button className="vaos-calendar__calendar-day vads-u-visibility--hidden" />
    );
  }

  const momentDate = moment(date);
  const dateDay = momentDate.format('D');
  const ariaDate = momentDate.format('dddd, MMMM Do');

  const cssClasses = ['vaos-calendar__calendar-day'];
  if (isCurrentlySelected) cssClasses.push('vaos-calendar__cell-current');
  if (inSelectedArray) cssClasses.push('vaos-calendar__cell-selected');

  return (
    <button
      id={`date-cell-${date}`}
      className={cssClasses.join(' ')}
      onClick={() => onClick(date)}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaDate}
      aria-expanded={isCurrentlySelected}
      type="button"
    >
      {inSelectedArray && <i className="fas fa-check vads-u-color--white" />}
      {dateDay}
      {isCurrentlySelected && (
        <span className="vaos-calendar__cell-selected-triangle" />
      )}
    </button>
  );
};

export default CalendarCell;
