import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import formConfig from './config/form';
import formConfigV2 from './config/form-v2';
import { NoFormPage } from './components/NoFormPage';

function BurialsEntry({ location, children, isLoadingFeatures }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const burialFormEnabled = useToggleValue(TOGGLE_NAMES.burialFormEnabled);
  const burialFormV2 = useToggleValue(TOGGLE_NAMES.burialFormV2);
  const redirectToHowToPage =
    burialFormEnabled === false && location.pathname !== '/introduction';
  if (redirectToHowToPage === true) {
    window.location.href = '/burials-memorials/veterans-burial-allowance/';
  }

  if (isLoadingFeatures !== false || redirectToHowToPage) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    return <NoFormPage />;
  }
  // if (burialFormV2) {
  //   return (
  //     <RoutedSavableApp formConfig={formConfigV2} currentLocation={location}>
  //       {children}
  //     </RoutedSavableApp>
  //   );
  // }
  return (
    <RoutedSavableApp
      formConfig={burialFormV2 ? formConfigV2 : formConfig}
      currentLocation={location}
    >
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  isLoadingFeatures: toggleValues(state).loading,
});
BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  isLoadingFeatures: PropTypes.bool,
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BurialsEntry);
