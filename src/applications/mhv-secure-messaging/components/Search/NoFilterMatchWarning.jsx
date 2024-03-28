import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import React, { useEffect, useRef } from 'react';

const NoFilterMatchWarning = () => {
  const warningRef = useRef();
  useEffect(() => {
    focusElement(warningRef.current);
  });
  return (
    <div ref={warningRef} aria-live="polite">
      <h2>We didn’t find any matches for these filters</h2>
      <span className="vads-u-font-weight--bold">
        Try changing your filter settings to find matches. Take these steps:
      </span>
      <ul>
        <li>
          Make sure you enter information from one of these fields: to, from,
          message ID, or subject. We can’t search for information inside the
          full messages.
        </li>
        <li>
          Make sure you’re in the right folder. We can only filter in one folder
          at a time.
        </li>
        <li>Check your spelling. We can only filter for exact matches.</li>
        <li>
          Try removing a filter. If you use too many filters, it’s harder to
          find a match.
        </li>
      </ul>
    </div>
  );
};

export default NoFilterMatchWarning;
