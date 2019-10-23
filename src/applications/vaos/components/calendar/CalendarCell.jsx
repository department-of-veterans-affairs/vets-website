import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

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

  const cssClasses = classNames('vaos-calendar__calendar-day', {
    'vaos-calendar__cell-current': isCurrentlySelected,
    'vaos-calendar__cell-selected': inSelectedArray,
  });

  return (
    <button
      id={`date-cell-${date}`}
      className={cssClasses}
      onClick={() => onClick(date)}
      disabled={disabled}
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
