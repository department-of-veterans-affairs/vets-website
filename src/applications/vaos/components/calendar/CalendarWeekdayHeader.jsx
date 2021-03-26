import React from 'react';

/**
 * @const {number} DEFAULT_WEEK_DAYS
 * @default Object { name: 'Monday, abbr: 'Mon', name: 'Tuesday, abbr: 'Tue', ...}
 */
const DEFAULT_WEEK_DAYS = [
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

/**
 * Calendar widget weekday header
 *
 * @param [showFullWeek=false] Whether to show weekend days or not
 * @returns {JSX.Element} Returns a row of calendar widget week days
 */
export default function CalendarWeekdayHeader({ showFullWeek = false }) {
  const daysToRender = showFullWeek
    ? [
        { name: 'Sunday', abbr: 'Sun' },
        ...DEFAULT_WEEK_DAYS,
        { name: 'Sunday', abbr: 'Sun' },
      ]
    : DEFAULT_WEEK_DAYS;

  return (
    <div role="rowgroup">
      <div
        className="vaos-calendar__weekday-container vads-u-display--flex vads-u-justify-content--space-between"
        role="row"
      >
        {daysToRender.map((day, index) => (
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
}
