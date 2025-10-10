import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import formConfig from './config/form';
import { useSetToggleParam } from '../hooks/useSetToggleParam';

export default function Form1995Entry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.merge1995And5490);
  const showRudisill1995 = useToggleValue(TOGGLE_NAMES.showRudisill1995);
  const mebReRoute = useToggleValue(TOGGLE_NAMES.meb1995ReReoute);

  useSetToggleParam(toggleValue, showRudisill1995);

  useEffect(
    () => {
      if (typeof mebReRoute === 'boolean') {
        sessionStorage.setItem('meb1995ReRoute', JSON.stringify(mebReRoute));
      } else {
        sessionStorage.setItem('meb1995ReRoute', 'false');
      }
    },
    [mebReRoute],
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
