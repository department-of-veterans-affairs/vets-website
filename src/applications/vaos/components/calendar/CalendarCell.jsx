import React from 'react';

const CalendarCell = ({
  date,
  formattedDate,
  isCurrentlySelected,
  isInSelectedMap,
  disabled,
  onClick,
}) => {
  if (date === null) {
    return (
      <button className="vaos-calendar__calendar-day vads-u-visibility--hidden" />
    );
  }

  const cssClasses = ['vaos-calendar__calendar-day'];
  if (isCurrentlySelected) cssClasses.push('vaos-calendar__cell-current');
  if (isInSelectedMap) cssClasses.push('vaos-calendar__cell-selected');

  return (
    <button
      id={`date-cell-${date}`}
      className={cssClasses.join(' ')}
      onClick={() => onClick(date)}
      disabled={disabled}
    >
      {isInSelectedMap && <i className="fas fa-check vads-u-color--white" />}
      {formattedDate}
      {isCurrentlySelected && (
        <span className="vaos-calendar__cell-selected-triangle" />
      )}
    </button>
  );
};

export default CalendarCell;
