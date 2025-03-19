import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import UnverifiedPrefillAlert from './UnverifiedPrefillAlert';

export const ShowAlertOrSip = ({ basename, sipOptions, bottom }) => {
  const loggedIn = useSelector(isLoggedIn);
  // Verified LOA3?
  const isVerified = useSelector(
    state => selectProfile(state)?.verified || false,
  );

  const classes = `sip-wrapper ${bottom ? 'vads-u-margin-y--2 bottom' : ''}`;

  if (!loggedIn && !bottom) {
    return null;
  }

  if (!loggedIn && !isVerified) {
    return <UnverifiedPrefillAlert basename={basename} />;
  }

  return (
    <div className={classes.showAlertOrSip}>
      <SaveInProgressIntro {...sipOptions} buttonOnly={bottom && loggedIn} />
    </div>
  );
};

ShowAlertOrSip.propTypes = {
  loginModalOn: PropTypes.func.isRequired,
  sipOptions: PropTypes.shape({
    formId: PropTypes.string.isRequired,
    messages: PropTypes.object,
    pageList: PropTypes.array.isRequired,
    startText: PropTypes.string.isRequired,
    unauthStartText: PropTypes.string,
    retentionPeriod: PropTypes.string,
    downtime: PropTypes.object,
    prefillEnabled: PropTypes.bool,
    verifyRequiredPrefill: PropTypes.string,
    unverifiedPrefillAlert: PropTypes.node,
    hideUnauthedStartLink: PropTypes.bool,
  }).isRequired,

  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  basename: PropTypes.string,
  bottom: PropTypes.bool,
};

export default ShowAlertOrSip;
