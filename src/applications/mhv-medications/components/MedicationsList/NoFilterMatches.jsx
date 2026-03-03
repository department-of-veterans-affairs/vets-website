import React from 'react';

const NoFilterMatches = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color vads-u-margin-top--3">
    <h3
      className="vads-u-margin--0"
      id="no-matches-msg"
      data-testid="zero-filter-results"
    >
      We didn’t find any matches for this filter
    </h3>
    <p className="vads-u-margin-y--2">Try selecting a different filter.</p>
  </div>
);

export default NoFilterMatches;
