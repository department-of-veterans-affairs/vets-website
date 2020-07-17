import React from 'react';
import PropTypes from 'prop-types';
import { CALENDAR_INDICATOR_TYPES } from '../../utils/constants';

export default function CalendarSelectedIndicator({
  date,
  selectedDates,
  fieldName,
  selectedIndicatorType,
}) {
  if (fieldName && selectedIndicatorType === CALENDAR_INDICATOR_TYPES.BUBBLES) {
    const bubbles = selectedDates
      .reduce((selectedFieldValues, currentDate) => {
        if (currentDate.date === date) {
          selectedFieldValues.push(currentDate[fieldName]);
        }
        return selectedFieldValues;
      }, [])
      .sort();

    return (
      <div className="vaos-calendar__indicator-bubbles-container">
        {bubbles.map((label, index) => (
          <div
            key={`${fieldName}-bubble-${index}`}
            className="vaos-calendar__indicator-bubble vads-u-border--2px vads-u-border-color--white vads-u-background-color--base"
          >
            {label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <i className="fas fa-check vads-u-color--white vaos-calendar__fa-check-position" />
  );
}

CalendarSelectedIndicator.propTypes = {
  selectedDates: PropTypes.array.isRequired,
};
