import React from 'react';

const days = [
  {
    name: 'Monday',
    abbr: 'Mon',
  },
  {
    name: 'Tuesday',
    abbr: 'Tue',
  },
  {
    name: 'Wednesday',
    abbr: 'Wed',
  },
  {
    name: 'Thursday',
    abbr: 'Thu',
  },
  {
    name: 'Friday',
    abbr: 'Fri',
  },
];

const CalendarWeekdayHeader = () => (
  <div role="rowgroup">
    <div
      className="vaos-calendar__weekday-container vads-u-display--flex vads-u-justify-content--space-between"
      role="row"
    >
      {days.map((day, index) => (
        <div
          key={`weekday-${index}`}
          role="columnheader"
          className="vaos-calendar__weekday vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0p5"
        >
          <span className="vads-u-display--none small-screen:vads-u-display--inline">
            {day.name}
          </span>
          <span className="small-screen:vads-u-display--none">
            <span aria-hidden="true">{day.abbr}</span>
            <span className="sr-only">{day.name}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default CalendarWeekdayHeader;
