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
  hasMultipleAddress,
  setFormData,
  formData,
}) => {
  const getFlipperData = useCallback(
    () => {
      if (hasMultipleAddress !== undefined) {
        setFormData({
          ...formData,
          'view:hasMultipleAddress': hasMultipleAddress,
        });
      }
    },
    [hasMultipleAddress],
  );

  useEffect(
    () => {
      getFlipperData();
    },

    [getFlipperData, hasMultipleAddress],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
  hasMultipleAddress: toggleValues(state)[
    FEATURE_FLAG_NAMES.multipleAddress1010ez
  ],
});

const mapDispatchToProps = {
  setFormData: setData,
};

HealthCareEntry.propTypes = {
  hasMultipleAddress: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCareEntry);
