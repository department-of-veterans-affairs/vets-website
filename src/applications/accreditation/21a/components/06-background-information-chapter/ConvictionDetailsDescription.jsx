import React from 'react';

import NotIncludedViolationsList from './NotIncludedViolationsList';

const ConvictionDetailsDescription = () => (
  <>
    <p>
      Your answers should include convictions resulting from a plea of no
      contest (nolo contendere), but do not include:
    </p>
    <NotIncludedViolationsList />
  </>
);

export default ConvictionDetailsDescription;
