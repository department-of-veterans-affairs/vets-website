import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

function BurialsEntry({ location, children, toggleFeatures }) {
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
      return <></>;
    }
    return <NoFormPage />;
  }

  if (burialFormV2) {
    window.location.href = '/burials-and-memorials-v2/application/530/';
    return <></>;
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
