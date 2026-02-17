import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import environment from 'platform/utilities/environment';
import { WIP } from '../../shared/components/WIP';
import formConfig from '../config/form';
import { workInProgressContent } from '../definitions/constants';

function App({
  location,
  children,
  showForm,
  isLoading,
  formData,
  setFormData,
  isEmailPresenceRequired,
  isDobValidationEnabled,
}) {
  useEffect(
    () => {
      const hasEmailPresenceChanged =
        formData['view:isEmailPresenceRequired'] !== isEmailPresenceRequired;
      const hasDobValidationChanged =
        formData['view:isDobValidationEnabled'] !== isDobValidationEnabled;

      if (hasEmailPresenceChanged || hasDobValidationChanged) {
        setFormData({
          ...formData,
          'view:isEmailPresenceRequired': isEmailPresenceRequired,
          'view:isDobValidationEnabled': isDobValidationEnabled,
        });
      }
    },
    [formData, isEmailPresenceRequired, isDobValidationEnabled, setFormData],
  );

  if (isLoading) {
    return (
      <va-loading-indicator
        message="Please wait while we load the application for you."
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }

  if (!showForm) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  isDobValidationEnabled: PropTypes.bool,
  isEmailPresenceRequired: PropTypes.bool,
  isLoading: PropTypes.bool,
  location: PropTypes.object,
  setFormData: PropTypes.func,
  showForm: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state?.form?.data || {},
  isLoading: state?.featureToggles?.loading,
  isDobValidationEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.form214140ValidateDob
  ],
  isEmailPresenceRequired: toggleValues(state)[
    FEATURE_FLAG_NAMES.form214140ValidateEmailPresence
  ],
  showForm:
    toggleValues(state)[FEATURE_FLAG_NAMES.form214140] ||
    environment.isLocalhost(),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
