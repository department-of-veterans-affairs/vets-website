import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { fetchTotalDisabilityRating } from './actions';
import formConfig from './config/form';

const HealthCareEntry = ({
  location,
  children,
  caregiverSIGIEnabled = false,
  hcaAmericanIndianEnabled = false,
  hcaShortFormEnabled = false,
  setFormData,
  formData,
  hasSavedForm,
  isLoggedIn,
  getTotalDisabilityRating,
  totalDisabilityRating,
  user,
}) => {
  useEffect(
    () => {
      if (isLoggedIn) {
        getTotalDisabilityRating();
      }
    },
    [getTotalDisabilityRating, isLoggedIn],
  );
  useEffect(
    // included veteranFullName to reset view flipper toggles when starting a new application from save-in-progress
    // So users can complete the form as they started, we want to use 'view:hcaShortFormEnabled' from save in progress data,
    // we can check using hasSavedForm. This can be removed 90 days after hcaShortFormEnabled flipper toggle is fully enabled for all users
    () => {
      if (hasSavedForm || typeof hasSavedForm === 'undefined') {
        setFormData({
          ...formData,
          'view:caregiverSIGIEnabled': caregiverSIGIEnabled,
          'view:hcaAmericanIndianEnabled': hcaAmericanIndianEnabled,
          'view:isLoggedIn': isLoggedIn,
          'view:totalDisabilityRating': totalDisabilityRating || 0,
          'view:userDob': user.dob,
        });
      } else if (isLoggedIn) {
        setFormData({
          ...formData,
          'view:caregiverSIGIEnabled': caregiverSIGIEnabled,
          'view:hcaAmericanIndianEnabled': hcaAmericanIndianEnabled,
          'view:hcaShortFormEnabled': hcaShortFormEnabled,
          'view:isLoggedIn': isLoggedIn,
          'view:totalDisabilityRating': totalDisabilityRating || 0,
          'view:userDob': user.dob,
        });
      } else {
        setFormData({
          ...formData,
          'view:caregiverSIGIEnabled': caregiverSIGIEnabled,
          'view:hcaAmericanIndianEnabled': hcaAmericanIndianEnabled,
          'view:hcaShortFormEnabled': hcaShortFormEnabled,
          'view:isLoggedIn': isLoggedIn,
        });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      caregiverSIGIEnabled,
      hcaAmericanIndianEnabled,
      hcaShortFormEnabled,
      formData.veteranFullName,
      hasSavedForm,
      isLoggedIn,
      totalDisabilityRating,
      user.dob,
    ],
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
  hcaShortFormEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.hcaShortFormEnabled
  ],
  hasSavedForm: state?.user?.profile?.savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_10_10EZ,
  ),
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  totalDisabilityRating: state.totalRating.totalDisabilityRating,
  user: state.user.profile,
});

const mapDispatchToProps = {
  setFormData: setData,
  getTotalDisabilityRating: fetchTotalDisabilityRating,
};

HealthCareEntry.propTypes = {
  caregiverSIGIEnabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  formData: PropTypes.object,
  getTotalDisabilityRating: PropTypes.func,
  hasSavedForm: PropTypes.bool,
  hcaAmericanIndianEnabled: PropTypes.bool,
  hcaShortFormEnabled: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  totalDisabilityRating: PropTypes.number,
  user: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCareEntry);
