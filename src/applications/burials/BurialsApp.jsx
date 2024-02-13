import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { VA_FORM_IDS } from 'platform/forms/constants';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

function BurialsEntry({ location, children, toggleFeatures, profile }) {
  const {
    loading: isLoadingFeatures,
    burialFormEnabled,
    burialFormV2,
  } = toggleFeatures;
  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      window.location.href = '/burials-memorials/veterans-burial-allowance/';
      return <React.Fragment />
    }
    return <NoFormPage />;
  }

  const metadataVersion2017 = 2;
  const metadataVersion2024 = 3;

  const hasV1Form = profile.savedForms.some(form => {
    return (
      form.form === VA_FORM_IDS.FORM_21P_530 && form.metadata.version === metadataVersion2017
    );
  });
  const hasV2Form = profile.savedForms.some(form => {
    return (
      form.form === VA_FORM_IDS.FORM_21P_530 && form.metadata.version === metadataVersion2024
    );
  });

  const shouldUseV2 = hasV2Form || (burialFormV2 && !hasV1Form);
  if (shouldUseV2) {
    window.location.href = '/burials-and-memorials-v2/application/530/';
    return <React.Fragment />
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => {
  return {
    toggleFeatures: toggleValues(state),
    profile: state.user.profile,
  };
};
BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  toggleFeatures: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurialsEntry);
