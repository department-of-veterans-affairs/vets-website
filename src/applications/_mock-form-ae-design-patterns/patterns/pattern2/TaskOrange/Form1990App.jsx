import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { PatternConfigContext } from '../../../shared/context/PatternConfigContext';

export default function Form1990Entry({ location, children }) {
  /* This useEffect is to add custom class to remove the extra margin-top for radio buttons
   in benefits-selection and review-and-submit pages. */
  useEffect(
    () => {
      const fieldset = document.querySelector('body');
      if (
        location.pathname.includes('benefits-selection') ||
        location.pathname === '/review-and-submit'
      ) {
        fieldset.classList.add('fieldset-wrapper');
      } else {
        fieldset.classList.remove('fieldset-wrapper');
      }
    },
    [location.pathname],
  );

  const formConfig = useContext(PatternConfigContext);

  return (
    <div className="vads-u-margin-top--4">
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}

Form1990Entry.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  location: PropTypes.object,
};
