import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import formConfig from './config/form';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function Form1995Entry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const toggleValue = useToggleValue(TOGGLE_NAMES.merge1995And5490);
  const [setLocalToggleValue] = useLocalStorage('toggleValue', toggleValue);

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

Form1995Entry.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  location: PropTypes.object,
};
