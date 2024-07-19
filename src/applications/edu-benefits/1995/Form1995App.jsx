import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import formConfig from './config/form';

export default function Form1995Entry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.merge1995And5490);

  useEffect(
    () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        toggleValue !== undefined &&
        toggleValue !== null &&
        toggleValue !== 'undefined'
      ) {
        urlParams.set('toggle', toggleValue);
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${urlParams.toString()}`;
        if (window.location.href !== newUrl) {
          window.location.href = newUrl;
        }
      }
    },
    [toggleValue],
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
