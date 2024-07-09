import React from 'react';

import NotIncludedViolationsList from './NotIncludedViolationsList';

const HasAConviction = () => (
  <>
    <p>
      This includes felonies, firearms, or explosive violations, misdemeanors,
      and all other offenses.
      <br />
      <br />
      This does not include:
    </p>
    <NotIncludedViolationsList />
  </>
);

export default HasAConviction;
