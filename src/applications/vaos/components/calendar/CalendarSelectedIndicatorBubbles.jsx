import React from 'react';
import PropTypes from 'prop-types';

const CalendarSelectedIndicatorBubbles = ({
  date,
  selectedDates,
  fieldName,
}) => (
  <div className="vaos-calendar__indicator-bubbles-container">
    {[...selectedDates]
      .filter(currentDate => currentDate.date === date)
      .sort((a, b) => (a[fieldName] < b[fieldName] ? -1 : 1))
      .map((d, index) => (
        <div
          key={`${d}-bubble-${index}`}
          className="vaos-calendar__indicator-bubble vads-u-border--2px vads-u-border-color--white vads-u-background-color--base"
        >
          {d[fieldName]}
        </div>
      ))}
  </div>
);

CalendarSelectedIndicatorBubbles.propTypes = {
  selectedDates: PropTypes.array.isRequired,
};

export default CalendarSelectedIndicatorBubbles;
