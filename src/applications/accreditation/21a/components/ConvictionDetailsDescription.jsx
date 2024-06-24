import React from 'react';

import NotIncludedViolationsList from './NotIncludedViolationsList';

const ConvictionDetailsDescription = () => (
  <>
    Your answers should include convictions resulting from a plea of no contest
    (nolo contendere), but do not include:
    <NotIncludedViolationsList />
  </>
);

export default ConvictionDetailsDescription;
