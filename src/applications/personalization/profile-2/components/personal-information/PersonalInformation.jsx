import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { handleDowntimeForSection } from 'applications/personalization/profile360/components/DowntimeBanner';
import { directDepositLoadError } from 'applications/personalization/profile360/selectors';

import PersonalInformationContent from './PersonalInformationContent';

const MyAlert = () => (
  <AlertBox
    status="warning"
    headline="We can’t access your contact information"
    className="vads-u-margin-bottom--4"
  >
    <p>We’re sorry. Something went wrong on our end. Please try again later.</p>
  </AlertBox>
);

const PersonalInformation = ({
  showNotAllDataAvailableError,
  hasUnsavedEdits,
}) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

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
        dependencies={[externalServices.mvi, externalServices.vet360]}
      >
        {showNotAllDataAvailableError && <MyAlert />}
        <PersonalInformationContent />
      </DowntimeNotification>
    </>
  );
};

PersonalInformation.propTypes = {
  showNotAllDataAvailableError: PropTypes.bool.isRequired,
  hasUnsavedEdits: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  showNotAllDataAvailableError: !!directDepositLoadError(state),
  hasUnsavedEdits: state.vet360.hasUnsavedEdits,
});

export default connect(
  mapStateToProps,
  null,
)(PersonalInformation);
