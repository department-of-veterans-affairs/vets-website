import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
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
  // add feature flip data to formData to use in hideIf() formBuilder callback
  useEffect(
    () => {
      if (hasMultipleAddress !== undefined) {
        setFormData({
          ...formData,
          hasMultipleAddress,
        });
      }
    },
    // only want this function to be hit if hasMultipleAddress changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasMultipleAddress],
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
