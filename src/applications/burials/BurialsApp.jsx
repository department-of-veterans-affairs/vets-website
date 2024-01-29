import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { formConfig, formConfigV2 } from './config/form';
import { NoFormPage } from './components/NoFormPage';
import { Redirect } from "react-router-dom";

function BurialsEntry({ location, children, toggleFeatures }) {
  const { loading: isLoadingFeatures, burialFormEnabled, burialFormV2 } = toggleFeatures;
  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      return <Redirect to='/burials-memorials/veterans-burial-allowance/' />;
    }
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={burialFormV2 ? formConfigV2 : formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => {
  return {
    toggleFeatures: toggleValues(state),
  }
};
BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  toggleFeatures: PropTypes.object.isRequired,
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurialsEntry);
