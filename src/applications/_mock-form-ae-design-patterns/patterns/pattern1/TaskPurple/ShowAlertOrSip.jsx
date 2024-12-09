import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import environment from 'platform/utilities/environment';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import NeedsToVerifyAlert from './NeedsToVerifyAlert';
import NeedsMissingInfoAlert from './NeedsMissingInfoAlert';

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
