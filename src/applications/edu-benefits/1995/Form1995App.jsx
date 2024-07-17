import React, { useEffect, useState } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import formConfig from './config/form';

export default function Form1995Entry({ location, children }) {
  const {
    useToggleValue,
    TOGGLE_NAMES,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isAppToggleLoading = useToggleLoadingValue(
    TOGGLE_NAMES.merge1995And5490,
  );
  const toggleValue = useToggleValue(TOGGLE_NAMES.merge1995And5490);

  const [currentToggleValue, setCurrentToggleValue] = useState(() => {
    // Initialize state with the current toggle value or a default value
    const storedToggleValue = localStorage.getItem('toggleValue');
    return storedToggleValue ? JSON.parse(storedToggleValue) : toggleValue;
  });

  useEffect(
    () => {
      if (!isAppToggleLoading && toggleValue !== null) {
        setCurrentToggleValue(toggleValue);
      }
    },
    [toggleValue, isAppToggleLoading],
  );

  useEffect(
    () => {
      if (!isAppToggleLoading) {
        localStorage.setItem('toggleValue', JSON.stringify(currentToggleValue));
      }
    },
    [currentToggleValue, isAppToggleLoading],
  );

  useEffect(
    () => {
      if (!isAppToggleLoading) {
        setCurrentToggleValue(toggleValue);
      }
    },
    [location.pathname, isAppToggleLoading, toggleValue],
  );
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
