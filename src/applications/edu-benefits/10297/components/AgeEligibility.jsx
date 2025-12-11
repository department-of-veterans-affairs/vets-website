import React from 'react';
import { useSelector } from 'react-redux';
import { selectProfile } from '~/platform/user/selectors';
import { getAgeInYears } from '../helpers';

export default function AgeEligibility() {
  const profile = useSelector(selectProfile);
  const age = getAgeInYears(profile?.dob);

  if (!Number.isFinite(age)) {
    return null;
  }

  if (age < 18) {
    return (
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
        role="alert"
      >
        <h2 slot="headline">You do not qualify</h2>
        <React.Fragment key=".1">
          <p className="vads-u-margin-y--0">
            You must be 18 or older to submit this application.
          </p>
        </React.Fragment>
      </va-alert>
    );
  }

  if (age > 62) {
    return (
      <va-alert
        close-btn-aria-label="Close notification"
        status="warning"
        visible
        role="alert"
        id="age-eligibility-alert"
      >
        <h2 slot="headline">You may not qualify</h2>
        <React.Fragment key=".1">
          <p className="vads-u-margin-y--0">
            If you're 62 or older, you may not be eligible for this program. You
            can still fill out the application. We'll review your information
            and let you know if you don't qualify.
          </p>
        </React.Fragment>
      </va-alert>
    );
  }

  return null;
}
