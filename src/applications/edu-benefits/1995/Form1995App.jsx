import React, { useEffect } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import formConfig from './config/form';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function Form1995Entry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const toggleValue = useToggleValue(TOGGLE_NAMES.merge1995And5490);
  // eslint-disable-next-line no-unused-vars
  const [_, setLocalToggleValue] = useLocalStorage('toggleValue', toggleValue);

  useEffect(
    () => {
      setLocalToggleValue(toggleValue);
    },
    [toggleValue, setLocalToggleValue],
  );
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
