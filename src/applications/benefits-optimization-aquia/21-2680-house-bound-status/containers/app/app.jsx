/**
 * @module containers/app
 * @description Main application container for VA Form 21-2680
 */

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import { VA_FORM_IDS } from 'platform/forms/constants';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
import { API_ENDPOINTS } from '@bio-aquia/21-2680-house-bound-status/constants';
import { legacySubmitTransformer } from '@bio-aquia/21-2680-house-bound-status/config/submit-transformer';
import { setMultiPartyEnabled } from '@bio-aquia/21-2680-house-bound-status/utils/multi-party-state';
import { useDatadogRum } from '@bio-aquia/shared/hooks';

/**
 * Main application container component for VA Form 21-2680 House Bound Status
 *
 * Wraps the form with RoutedSavableApp to provide save-in-progress functionality,
 * auto-save on navigation, form state management, and session timeout handling.
 * This component is guarded by feature flags.
 *
 * When multi-party is enabled, the form submits to the multi-party endpoint
 * and collects the medical professional's email. When disabled, it uses the
 * legacy single-party submission flow.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child route components (form pages)
 * @param {Object} props.location - React Router location object
 */
export const App = ({ location, children }) => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isLoadingFeatures = useToggleLoadingValue();
  const formEnabled = useToggleValue(TOGGLE_NAMES.form2680Enabled);
  const multiPartyEnabled = useToggleValue(
    TOGGLE_NAMES.form2680MultiPartyFormsEnabled,
  );

  // Initialize Datadog RUM for form monitoring
  useDatadogRum('21-2680');

  // Sync the toggle state to the module-level holder so that the `depends`
  // function in form.js can read it at page-evaluation time. This is necessary
  // because routes are pre-created at module load time and prop-level config
  // overrides don't affect `depends` evaluation.
  setMultiPartyEnabled(multiPartyEnabled);

  // Build the active form config based on the multi-party feature toggle.
  // When multi-party is disabled, override to use the legacy endpoint and transformer.
  // Page visibility is handled by the `depends` function in form.js which reads
  // the toggle state from the module-level holder set above.
  const activeFormConfig = useMemo(
    () => {
      if (multiPartyEnabled) return formConfig;

      return {
        ...formConfig,
        formId: VA_FORM_IDS.FORM_21_2680,
        submitUrl: API_ENDPOINTS.submitForm,
        transformForSubmit: legacySubmitTransformer,
      };
    },
    [multiPartyEnabled],
  );

  // Show loading indicator while feature flags are being fetched
  if (isLoadingFeatures) {
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          label="Loading"
          message="Loading application..."
          set-focus
        />
      </div>
    );
  }

  // Redirect to home if form is disabled
  if (!formEnabled) {
    window.location.replace('/forms/about-form-21-2680/');
    return null;
  }

  // Render app with the appropriate form config
  return (
    <RoutedSavableApp formConfig={activeFormConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

export default App;
