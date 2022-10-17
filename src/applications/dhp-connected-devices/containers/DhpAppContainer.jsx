import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dhpConnectedDevicesFitbitFeature } from '../utils/helpers';
import { PageNotFound } from '../components/PageNotFound';
import App from './App';

export const DhpAppContainer = ({
  isFeatureToggleLoading,
  showConnectedDevicesPage,
}) => {
  const pageContent = showConnectedDevicesPage ? <App /> : <PageNotFound />;
  return isFeatureToggleLoading ? (
    <va-loading-indicator set-focus />
  ) : (
    pageContent
  );
};

DhpAppContainer.propTypes = {
  isFeatureToggleLoading: PropTypes.bool,
  showConnectedDevicesPage: PropTypes.bool,
};

const mapStateToProps = state => {
  const isFeatureToggleLoading = state?.featureToggles?.loading;
  const showConnectedDevicesPage = dhpConnectedDevicesFitbitFeature(state);
  return { isFeatureToggleLoading, showConnectedDevicesPage };
};

export default connect(mapStateToProps)(DhpAppContainer);
