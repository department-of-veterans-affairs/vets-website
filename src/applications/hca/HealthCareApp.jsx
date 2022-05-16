import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import formConfig from './config/form';

const HealthCareEntry = ({
  location,
  children,
  caregiverSIGIEnabled = false,
  hcaAmericanIndianEnabled = false,
  setFormData,
  formData,
}) => {
  const getFlipperData = useCallback(
    () => {
      if (caregiverSIGIEnabled !== undefined) {
        setFormData({
          ...formData,
          'view:caregiverSIGIEnabled': caregiverSIGIEnabled,
        });
      }

      if (hcaAmericanIndianEnabled !== undefined) {
        setFormData({
          ...formData,
          'view:hcaAmericanIndianEnabled': hcaAmericanIndianEnabled,
          'view:hcaShortFormEnabled': false,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [caregiverSIGIEnabled, hcaAmericanIndianEnabled],
  );

  useEffect(
    () => {
      getFlipperData();
    },

    [getFlipperData, caregiverSIGIEnabled],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
  caregiverSIGIEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.caregiverSIGIEnabled
  ],
  hcaAmericanIndianEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.hcaAmericanIndianEnabled
  ],
});

const mapDispatchToProps = {
  setFormData: setData,
};

HealthCareEntry.propTypes = {
  caregiverSIGIEnabled: PropTypes.bool,
  formData: PropTypes.object,
  hcaAmericanIndianEnabled: PropTypes.bool,
  setFormData: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCareEntry);
