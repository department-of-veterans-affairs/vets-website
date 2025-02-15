import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setData } from '../../forms-system/src/js/actions';
import TOGGLE_NAMES from './featureFlagNames';

export const toggleValuesSelector = state => state.featureToggles || {};

export const loadingTogglesSelector = state => state?.featureToggles?.loading;

export const useFeatureToggle = () => {
  /**
   * Get feature toggle value
   * @param {String} toggleName - feature flag name
   * @returns {Boolean} - feature flag value
   */
  const useToggleValue = toggleName => {
    if (!Object.values(TOGGLE_NAMES).includes(toggleName)) {
      throw new Error(
        `Invalid toggle name "${toggleName}". Did you add the toggle name to featureFlagNames.js?`,
      );
    }
    return useSelector(state => toggleValuesSelector(state)?.[toggleName]);
  };

  /**
   * Get feature toggle loading state
   * @returns {Boolean} - feature flag loading state
   */
  const useToggleLoadingValue = () => {
    return useSelector(state => loadingTogglesSelector(state));
  };

  /**
   * @typedef ToggleNames
   * @type {Array<String>}
   * @property {String|Array<string>} toggleName - feature flag name
   * @property {String} [formDataName] - feature name in the form & session data
   * @example
   * useFormFeatureToggleSync(['toggleOne']);
   * useFormFeatureToggleSync(['toggleOne', 'toggleTwo']);
   * useFormFeatureToggleSync([
   *   'toggleOne',
   *   ['toggleTwo', 'toggle2FormData'],
   * ]);
   * useFormFeatureToggleSync([
   *   ['toggleOne', 'toggleOneFormData'],
   *   ['toggleTwo', 'toggle2FormData'],
   * ]);
   */
  /**
   * Add feature toggle & sync value in to the form data
   * @param {ToggleNames} toggleNames - feature flag name
   */
  const useFormFeatureToggleSync = toggleNames => {
    if (!Array.isArray(toggleNames)) {
      throw new Error('toggleNames must be an array of feature toggle names');
    }

    const dispatch = useDispatch();
    const formData = useSelector(state => state?.form?.data || {});
    const isLoadingFeatureFlags = useToggleLoadingValue();
    const featureToggles = useSelector(toggleValuesSelector);

    const toggleData = useMemo(
      () =>
        toggleNames.reduce((acc, toggle) => {
          const [toggleName, formDataName] = Array.isArray(toggle)
            ? toggle
            : [toggle];
          const dataName = formDataName || toggleName;
          const toggleValue = featureToggles[(TOGGLE_NAMES?.[toggleName])];

          if (!isLoadingFeatureFlags && formData[dataName] !== toggleValue) {
            sessionStorage.setItem(dataName, toggleValue);
            return { ...acc, [dataName]: toggleValue };
          }
          return acc;
        }, {}),
      [toggleNames, featureToggles, isLoadingFeatureFlags, formData],
    );

    useEffect(
      () => {
        if (Object.keys(toggleData).length) {
          dispatch(setData({ ...formData, ...toggleData }));
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [toggleData],
    );
  };

  return {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
    useFormFeatureToggleSync,
  };
};
