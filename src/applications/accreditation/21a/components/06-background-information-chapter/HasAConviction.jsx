import React from 'react';

import NotIncludedViolationsList from './NotIncludedViolationsList';

const HasAConviction = () => (
  <>
    <p>
      <strong>Note:</strong> This includes felonies, firearms or explosive
      violations, misdemeanors, convictions resulting from a plea of nolo
      contendere (no contest), and all other offenses. Omit:
    </p>
    <NotIncludedViolationsList />
  </>
);

export default HasAConviction;
