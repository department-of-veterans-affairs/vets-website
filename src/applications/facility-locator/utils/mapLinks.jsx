import React from 'react';

export const otherToolsLink = () => (
  <p id="other-tools">
    Can’t find what you’re looking for?&nbsp;&nbsp;
    {/* Add a line break for mobile, which uses white-space: pre-line */}
    {'\n'}
    <va-link
      href="https://www.va.gov/directory/guide/home.asp"
      text="Try using our other tools to search."
    />
  </p>
);
