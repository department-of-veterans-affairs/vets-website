import React from 'react';
import { DEFAULT_WEEK_DAYS } from '../../utils/constants';

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
        { name: 'Saturday', abbr: 'Sat' },
      ]
    : DEFAULT_WEEK_DAYS;

  return (
    <div role="rowgroup">
      <div
        className="vaos-calendar__weekday-container vads-u-display--flex vads-u-justify-content--space-around"
        role="row"
      >
        {daysToRender.map((day, index) => (
          <div
            key={`weekday-${index}`}
            role="columnheader"
            className="vaos-calendar__weekday vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0p5"
          >
            <span className="vads-u-display--none large-screen:vads-u-display--inline">
              {day.name}
            </span>
            <span className="large-screen:vads-u-display--none">
              <span aria-hidden="true">{day.abbr}</span>
              <span className="sr-only">{day.name}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
