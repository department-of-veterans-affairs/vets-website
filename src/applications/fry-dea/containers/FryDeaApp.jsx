import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import { setData } from 'platform/forms-system/src/js/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import formConfig from '../config/form';

function FryDeaApp({
  children,
  formData,
  location,
  setFormData,
  showUpdatedFryDeaApp,
}) {
  useEffect(
    () => {
      if (showUpdatedFryDeaApp !== formData.showUpdatedFryDeaApp) {
        setFormData({
          ...formData,
          showUpdatedFryDeaApp,
        });
      }
    },
    [formData, location.pathname, setFormData, showUpdatedFryDeaApp],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
const mapStateToProps = state => ({
  formData: state.form?.data || {},
  showUpdatedFryDeaApp: toggleValues(state)[
    FEATURE_FLAG_NAMES.showUpdatedFryDeaApp
  ],
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FryDeaApp);
