import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import NeedsToVerifyAlert from './NeedsToVerifyAlert';

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

  if (loggedIn && !isVerified) {
    return bottom ? (
      <div className={classes} />
    ) : (
      <NeedsToVerifyAlert basename={basename} />
    );
  }

  return (
    <div className={classes.showAlertOrSip}>
      <SaveInProgressIntro
        {...sipOptions}
        headingLevel={2}
        ariaLabel="Start your debt dispute"
        devOnly={{
          forceShowFormControls: true,
        }}
      />
    </div>
  );
};

ShowAlertOrSip.propTypes = {
  formConfig: PropTypes.shape({
    prefillEnabled: PropTypes.bool.isRequired,
    savedFormMessages: PropTypes.object.isRequired,
  }).isRequired,

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

  basename: PropTypes.string,
  bottom: PropTypes.bool,
};

export default ShowAlertOrSip;
