import React from 'react';
import environment from 'platform/utilities/environment';

export default function SpecializedMissionModalContent() {
  return (
    <>
      <h3>
        {' '}
        {environment.isProduction() ? 'Specialized mission' : 'Community Focus'}
      </h3>
      <p>
        Is the school single-gender, a Historically Black college or university,
        or does it have a religious affiliation?
      </p>
    </>
  );
}
