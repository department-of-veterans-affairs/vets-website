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
    video. We require everyone entering a VA facility to wear a{' '}
    <a href="/coronavirus-veteran-frequently-asked-questions/#more-health-care-questions">
      mask that covers their mouth and nose.
    </a>{' '}
    Get answers to questions about COVID-19 and VA benefits and services with
    our <a href="/coronavirus-chatbot/">coronavirus chatbot</a>.
  </>
);
