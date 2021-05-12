import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

export default function Loader() {
  return (
    <div className="vads-u-margin-y--4 vads-u-padding-y--0p5">
      <LoadingIndicator message="Please wait while we load the application for you." />
    </div>
  );
}
