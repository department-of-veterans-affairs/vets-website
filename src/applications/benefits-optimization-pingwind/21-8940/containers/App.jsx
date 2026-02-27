import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';
import { viewFieldNames } from '../definitions/constants';

function App({
  location,
  children,
  formData,
  setFormData,
  isLeavingLastPositionExplanationEnabled,
}) {
  const hasViewFieldChanged =
    formData[viewFieldNames.isLeavingLastPositionExplanationEnabled] !==
    isLeavingLastPositionExplanationEnabled;

  useEffect(
    () => {
      if (hasViewFieldChanged) {
        setFormData({
          ...formData,
          [viewFieldNames.isLeavingLastPositionExplanationEnabled]: isLeavingLastPositionExplanationEnabled,
        });
      }
    },
    [
      formData,
      hasViewFieldChanged,
      isLeavingLastPositionExplanationEnabled,
      setFormData,
    ],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle="veteran's application for increase compensation based on unemployability"
        dependencies={[externalServices.lighthouseBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  formData: PropTypes.object,
  isLeavingLastPositionExplanationEnabled: PropTypes.bool,
  location: PropTypes.object.isRequired,
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state?.form?.data || {},
  isLeavingLastPositionExplanationEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.form218940LeavingLastPosition
  ],
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
