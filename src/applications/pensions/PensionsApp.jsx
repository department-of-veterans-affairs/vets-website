import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

function PensionEntry({ location, children, isLoadingFeatures }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionFormEnabled = useToggleValue(TOGGLE_NAMES.pensionFormEnabled);
  const redirectToHowToPage =
    pensionFormEnabled === false && location.pathname !== '/introduction';
  if (redirectToHowToPage === true) {
    window.location.href = '/pension/survivors-pension/';
  }

  if (isLoadingFeatures !== false || redirectToHowToPage) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!pensionFormEnabled) {
    return <NoFormPage />;
  }
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  isLoadingFeatures: toggleValues(state).loading,
});
PensionEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  isLoadingFeatures: PropTypes.bool,
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PensionEntry);
