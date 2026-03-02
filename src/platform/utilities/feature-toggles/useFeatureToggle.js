import { useDebugValue, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setData } from '../../forms-system/src/js/actions';
import TOGGLE_NAMES from './featureFlagNames';

export { TOGGLE_NAMES };

export const toggleValuesSelector = state => state.featureToggles || {};

export const loadingTogglesSelector = state => state?.featureToggles?.loading;

/**
 * Configuration type for a single feature toggle
 * @typedef { Object } ToggleConfig
 * @property { string } toggleName - CamelCased name of the feature toggle example: 'profileUseExperimental'
 * @property { string } [formKey] - Optional custom key for form / session storage
 */

/**
 * Get feature toggle loading state
 * @returns {Boolean} - feature flag loading state
 */
export const useToggleLoadingValue = () => {
  return useSelector(state => loadingTogglesSelector(state));
};

/**
 * Hook to sync feature toggles with form data and session storage
 * @param {(string|ToggleConfig)[]} toggles - Array of toggle name strings or ToggleConfig objects
 * @param {Function} [setStorageItem] - Storage setter function (defaults to sessionStorage.setItem)
 */
export const useFormFeatureToggleSync = (
  toggles,
  setStorageItem = window.sessionStorage.setItem.bind(window.sessionStorage),
) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state?.form?.data ?? {});
  const isLoadingFeatureFlags = useToggleLoadingValue();
  const featureToggles = useSelector(toggleValuesSelector);

  // Normalize toggle configurations
  const normalizedToggles = useMemo(
    () =>
      toggles.map(toggle => {
        if (typeof toggle === 'string') {
          return { toggleName: toggle, formKey: toggle };
        }
        return { ...toggle, formKey: toggle.formKey ?? toggle.toggleName };
      }),
    [toggles],
  );

  // Calculate updates needed for form data and storage
  const updates = useMemo(
    () => {
      if (isLoadingFeatureFlags) return {};

      return normalizedToggles.reduce((acc, { toggleName, formKey }) => {
        const toggleValue = featureToggles[(TOGGLE_NAMES?.[toggleName])];
        // Only include in updates if the value differs from current form data
        if (toggleValue !== formData?.[formKey]) {
          setStorageItem(formKey, String(toggleValue));
          return { ...acc, [formKey]: toggleValue };
        }

        return acc;
      }, {});
    },
    [
      normalizedToggles,
      featureToggles,
      isLoadingFeatureFlags,
      formData,
      setStorageItem,
    ],
  );

  // Only dispatch if we have actual updates
  useEffect(
    () => {
      const updateCount = Object.keys(updates).length;
      if (updateCount > 0) {
        dispatch(setData({ ...formData, ...updates }));
      }
    },
    [updates, dispatch, formData],
  );
};

/**
 * Get feature toggle value
 * @param {String} toggleName - feature flag name
 * @returns {Boolean} - feature flag value
 */
export const useToggleValue = toggleName => {
  if (!Object.values(TOGGLE_NAMES).includes(toggleName)) {
    throw new Error(
      `Invalid toggle name "${toggleName}". Did you add the toggle name to featureFlagNames.js?`,
    );
  }
  const toggleValue = useSelector(
    state => toggleValuesSelector(state)?.[toggleName],
  );
  useDebugValue(
    toggleValue,
    value => `${toggleName} value: ${value} type: ${typeof value}`,
  );
  return toggleValue;
};

export const useFeatureToggle = () => {
  return {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
    useFormFeatureToggleSync,
  };
};
