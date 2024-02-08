import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { formConfig } from './config/form';
import { NoFormPage } from './components/NoFormPage';
import { VA_FORM_IDS } from 'platform/forms/constants';

function BurialsEntry({ location, children, toggleFeatures, profile }) {
  const { loading: isLoadingFeatures, burialFormEnabled, burialFormV2 } = toggleFeatures;
  if (isLoadingFeatures || profile.loading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      window.location.href = '/burials-memorials/veterans-burial-allowance/';
    }
    return <NoFormPage />;
  }

  const hasV1Form = profile.savedForms.some((form) => {
    // Two is the correct metadata version.
    return form.form === VA_FORM_IDS.FORM_21P_530 && form.metadata.version === 2;
  });
  const hasV2Form = profile.savedForms.some((form) => {
    // Three is the correct metadata version.
    return form.form === VA_FORM_IDS.FORM_21P_530 && form.metadata.version === 3;
  });

  console.log(hasV2Form);
  const shouldUseV2 = hasV2Form || (burialFormV2 && !hasV1Form);

  if (!shouldUseV2) {
    window.location.href = '/burials-and-memorials/application/530/';
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => {
  console.log(state);
  console.log(state.user.profile.loading);
  console.log(state.user.profile.savedForms)
  return {
    toggleFeatures: toggleValues(state),
    profile: state.user.profile,
  }
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
