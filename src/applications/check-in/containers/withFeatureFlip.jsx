import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import {
  checkInExperienceEnabled,
  checkInExperienceDemographicsPageEnabled,
  checkInExperienceMultipleAppointmentEnabled,
  checkInExperienceNextOfKinEnabled,
  checkInExperienceUpdateInformationPageEnabled,
  loadingFeatureFlags,
} from '../selectors';

const withFeatureFlip = Component => {
  const Wrapped = ({ isCheckInEnabled, isLoadingFeatureFlags, ...props }) => {
    if (isLoadingFeatureFlags) {
      return (
        <>
          <LoadingIndicator message="Loading your check in experience" />
        </>
      );
    } else if (!isCheckInEnabled) {
      window.location.replace('/');
      return <></>;
    } else {
      return (
        <>
          <meta name="robots" content="noindex" />
          <Component {...props} />
        </>
      );
    }
  };

  Wrapped.propTypes = {
    isCheckInEnabled: PropTypes.bool,
    isLoadingFeatureFlags: PropTypes.bool,
  };

  return Wrapped;
};

const mapStateToProps = state => ({
  isCheckInEnabled: checkInExperienceEnabled(state),
  isDemographicsPageEnabled: checkInExperienceDemographicsPageEnabled(state),
  isLoadingFeatureFlags: loadingFeatureFlags(state),
  isMultipleAppointmentsEnabled: checkInExperienceMultipleAppointmentEnabled(
    state,
  ),
  isNextOfKinEnabled: checkInExperienceNextOfKinEnabled(state),
  isUpdatePageEnabled: checkInExperienceUpdateInformationPageEnabled(state),
});

const composedWrapper = compose(
  connect(mapStateToProps),
  withFeatureFlip,
);
export default composedWrapper;
