import PropTypes from 'prop-types';
import React from 'react';

export function getSelectedLabel(date, selectedDates) {
  const matchingTimes = selectedDates.filter(selected =>
    selected.startsWith(date),
  );

  if (matchingTimes.length === 2) {
    return 'AM and PM selected.';
  }
  if (new Date(matchingTimes[0]).getHours() >= 12) {
    return 'PM selected.';
  }

  return 'AM selected.';
}

export default function SelectedIndicator({ date, selectedDates }) {
  const bubbles = selectedDates
    .reduce((selectedFieldValues, currentDate) => {
      if (currentDate.startsWith(date)) {
        selectedFieldValues.push(
          new Date(currentDate).getHours() >= 12 ? 'PM' : 'AM',
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

SelectedIndicator.propTypes = {
  date: PropTypes.string.isRequired,
  selectedDates: PropTypes.arrayOf(PropTypes.string).isRequired,
};
