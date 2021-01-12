import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CALENDAR_INDICATOR_TYPES } from '../../utils/constants';

export default function CalendarSelectedIndicator({
  date,
  selectedDates,
  selectedIndicatorType,
}) {
  if (selectedIndicatorType === CALENDAR_INDICATOR_TYPES.BUBBLES) {
    const bubbles = selectedDates
      .reduce((selectedFieldValues, currentDate) => {
        if (currentDate.startsWith(date)) {
          selectedFieldValues.push(
            moment(currentDate).hour() >= 12 ? 'PM' : 'AM',
          );
        }
        return selectedFieldValues;
      }, [])
      .sort();

    return (
      <div className="vaos-calendar__indicator-bubbles-container">
        {bubbles.map(label => (
          <div
            key={`bubble-${label}`}
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
  date: PropTypes.string.isRequired,
  selectedIndicatorType: PropTypes.string,
};
