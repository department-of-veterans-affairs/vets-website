import React from 'react';
import PropTypes from 'prop-types';

const CalendarSelectedIndicatorBubbles = ({ selectedDates, fieldName }) => (
  <div className="vaos-calendar__indicator-bubbles-container">
    {[...selectedDates]
      .sort((a, b) => (a[fieldName] < b[fieldName] ? -1 : 1))
      .map((date, index) => (
        <div
          key={`${date}-bubble-${index}`}
          className="vaos-calendar__indicator-bubble"
        >
          {date[fieldName]}
        </div>
      ))}
  </div>
);

CalendarSelectedIndicatorBubbles.propTypes = {
  selectedDates: PropTypes.array.isRequired,
};

export default CalendarSelectedIndicatorBubbles;
