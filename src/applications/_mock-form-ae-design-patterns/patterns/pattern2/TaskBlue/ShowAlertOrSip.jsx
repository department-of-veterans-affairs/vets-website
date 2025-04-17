import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import environment from 'platform/utilities/environment';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import SaveInProgressIntro from './SaveInProgressIntro';
import NeedsToVerifyAlert from './content/NeedsToVerifyAlert';

export const heading = 'We’re missing some of your personal information';

const NeedsMissingInfoAlert = ({ missing }) => {
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef?.current) {
      focusElement(alertRef.current);
    }
  }, [alertRef]);

  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'warning',
    'alert-box-heading': heading,
    'error-key': 'missing_ssn_or_dob',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': `Missing ${missing}`,
  });

  return (
    <va-alert status="error" ref={alertRef}>
      <h2 slot="headline">{heading}</h2>
      <p>
        You’ll need to provide us with the missing information before you can
        fill out a Supplemental Claim request. Call the Defense Manpower Data
        Center (DMDC) support office at <va-telephone contact="8005389552" /> to
        make sure we have your {missing}. They’re open Monday through Friday,
        8:00 a.m. to 8:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        . If you have hearing loss, call{' '}
        <va-telephone contact="8663632883" tty />.
      </p>
    </va-alert>
  );
};

NeedsMissingInfoAlert.propTypes = {
  missing: PropTypes.string,
};

const ShowAlertOrSip = ({ basename, sipOptions, bottom }) => {
  const loggedIn = useSelector(isLoggedIn);
  // Verified LOA3?
  const isVerified = useSelector(
    state => selectProfile(state)?.verified || false,
  );
  // profile.claims.appeals indicates that the Veteran can apply for an
  // appeal (is LOA3 AND has a SSN). See
  // vets-api/app/policies/appeals_policy.rb - We need to use this because
  // the SSN is available from prefill, but is not obtained until the form is
  // started :(
  // enable profile.claims by turning on `profile_user_claims` feature
  const canApply = useSelector(
    state => selectProfile(state).claims?.appeals || environment.isLocalhost(),
  );
  const hasDob = useSelector(state => !!(selectProfile(state)?.dob || ''));
  const fullName = useSelector(
    state => selectProfile(state)?.userFullName || {},
  );

  // Don't render any alerts if not logged in and rendering the top slot
  if (!loggedIn && !bottom) {
    return null;
  }

  const classes = `sip-wrapper ${bottom ? 'vads-u-margin-y--2 bottom' : ''}`;

  // Without being LOA3 (verified), the prefill & contestable issues won't load
  if (loggedIn && !isVerified) {
    return bottom ? (
      <div className={classes} />
    ) : (
      <NeedsToVerifyAlert basename={basename} />
    );
  }

  // Missing last name, SSN, or DOB
  if (loggedIn && (!canApply || !hasDob || !fullName.last)) {
    const missingList = [
      fullName.last ? '' : 'full name', // first name can be blank
      canApply ? '' : 'Social Security number',
      hasDob ? '' : 'date of birth',
    ].filter(Boolean);
    const missing = readableList(missingList);
    return bottom ? (
      <div className={classes} />
    ) : (
      <NeedsMissingInfoAlert missing={missing} />
    );
  }

  return (
    <div className={classes}>
      <SaveInProgressIntro {...sipOptions} buttonOnly={bottom && loggedIn} />
    </div>
  );
};

ShowAlertOrSip.propTypes = {
  basename: PropTypes.string,
  bottom: PropTypes.bool,
  sipOptions: PropTypes.shape({}),
};

export default ShowAlertOrSip;
