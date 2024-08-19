import React from 'react';

import NotIncludedViolationsList from './NotIncludedViolationsList';

const IsUnderCharges = () => (
  <>
    <p>
      <strong>Note:</strong> Include convictions resulting from a plea of nolo
      contendere (no contest), but omit:
    </p>
    <NotIncludedViolationsList />
  </>
);

export default IsUnderCharges;
