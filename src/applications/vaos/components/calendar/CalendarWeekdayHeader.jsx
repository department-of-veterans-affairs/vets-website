import React, { useState, useEffect } from 'react';
import debounce from 'platform/utilities/data/debounce';

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

const mediaQuery = window.matchMedia('(min-width: 481px)');

export default function CalendarWeekdayHeader() {
  const [isSmallScreenOrLarger, setIsSmallScreenOrLarger] = useState(
    mediaQuery.matches,
  );

  useEffect(() => {
    const onResize = debounce(50, () => {
      if (mediaQuery.matches !== isSmallScreenOrLarger) {
        setIsSmallScreenOrLarger(mediaQuery.matches);
      }
    });

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return (
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
            {isSmallScreenOrLarger && day.name}
            {!isSmallScreenOrLarger && (
              <>
                <span aria-hidden="true">{day.abbr}</span>
                <span className="sr-only">{day.name}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
