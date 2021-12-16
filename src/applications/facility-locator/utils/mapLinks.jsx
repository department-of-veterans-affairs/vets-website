import React from 'react';

export const otherToolsLink = () => (
  <div id="other-tools">
    Can’t find what you’re looking for?&nbsp;&nbsp;
    {/* Add a line break for mobile, which uses white-space: pre-line */}
    {'\n'}
    <a href="https://www.va.gov/directory/guide/home.asp">
      Try using our other tools to search.
    </a>
  </div>
);

export const coronavirusUpdate = (
  <>
    Please call first to confirm services or ask about getting help by phone or
    video. We follow CDC{' '}
    <a href="/coronavirus-veteran-frequently-asked-questions/#more-coronavirus-specific-conc">
      guidelines for wearing masks at our facilities
    </a>
    .
  </>
);
