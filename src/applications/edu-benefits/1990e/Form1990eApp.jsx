import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import formConfig from './config/form';

function Form1990eEntry({
  children,
  formData,
  location,
  setFormData,
  showUpdatedToeApp,
}) {
  useEffect(
    () => {
      if (showUpdatedToeApp !== formData.showUpdatedToeApp) {
        setFormData({
          ...formData,
          showUpdatedToeApp,
        });
      }
    },
    [formData, location, showUpdatedToeApp],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  showUpdatedToeApp: toggleValues(state)[FEATURE_FLAG_NAMES.showUpdatedToeApp],
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form1990eEntry);
