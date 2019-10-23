import React from 'react';
import isMobile from 'ismobilejs';

/**
 * Renders days of week table header
 */
const days = isMobile.phone
  ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const CalendarWeekdayHeader = () => (
  <div className="vaos-calendar__weekday-container vads-u-display--flex vads-u-justify-content--space-between">
    {days.map((day, index) => (
      <div
        key={`weekday-${index}`}
        className="vaos-calendar__weekday vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0p5"
      >
        {day}
      </div>
    ))}
  </div>
);

export default CalendarWeekdayHeader;
