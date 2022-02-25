import React from 'react';

export default function EnrollmentVerificationLoadingIndicator() {
  return (
    <div className="vads-u-margin-y--5">
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
        set-focus
      />
    </div>
  );
}
