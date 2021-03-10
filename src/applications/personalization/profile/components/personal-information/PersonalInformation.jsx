import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { hasVAPServiceConnectionError } from '~/platform/user/selectors';
import { focusElement } from '~/platform/utilities/ui';

import PaymentInformationBlocked from '@@profile/components/direct-deposit/PaymentInformationBlocked';
import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import { cnpDirectDepositIsBlocked } from '@@profile/selectors';

import PersonalInformationContent from './PersonalInformationContent';

import { PROFILE_PATHS } from '../../constants';

const PersonalInformation = ({
  showDirectDepositBlockedError,
  hasUnsavedEdits,
  hasVAPServiceError,
}) => {
  const lastLocation = useLastLocation();
  useEffect(() => {
    document.title = `Personal And Contact Information | Veterans Affairs`;
  }, []);

  useEffect(
    () => {
      // Do not manage the focus if the user just came to this route via the
      // root profile route. If a user got to the Profile via a link to /profile
      // or /profile/ we want to focus on the "Profile" sub-nav H1, not the
      // H2 on this page
      const pathRegExp = new RegExp(`${PROFILE_PATHS.PROFILE_ROOT}/?$`);
      if (lastLocation?.pathname.match(new RegExp(pathRegExp))) {
        return;
      }
      focusElement('[data-focus-target]');
    },
    [lastLocation],
  );

  useEffect(
    () => {
      // Show alert when navigating away
      if (hasUnsavedEdits) {
        window.onbeforeunload = () => true;
        return;
      }

      window.onbeforeunload = undefined;
    },
    [hasUnsavedEdits],
  );

  return (
    <>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={hasUnsavedEdits}
      />
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Personal and contact information
      </h2>
      <DowntimeNotification
        render={handleDowntimeForSection('personal and contact')}
        dependencies={[externalServices.mvi, externalServices.vaProfile]}
      >
        {showDirectDepositBlockedError && <PaymentInformationBlocked />}
        <PersonalInformationContent hasVAPServiceError={hasVAPServiceError} />
      </DowntimeNotification>
    </>
  );
};

PersonalInformation.propTypes = {
  showDirectDepositBlockedError: PropTypes.bool.isRequired,
  hasUnsavedEdits: PropTypes.bool.isRequired,
  hasVAPServiceError: PropTypes.bool,
};

const mapStateToProps = state => ({
  showDirectDepositBlockedError: !!cnpDirectDepositIsBlocked(state),
  hasUnsavedEdits: state.vapService.hasUnsavedEdits,
  hasVAPServiceError: hasVAPServiceConnectionError(state),
});

export default connect(
  mapStateToProps,
  null,
)(PersonalInformation);
