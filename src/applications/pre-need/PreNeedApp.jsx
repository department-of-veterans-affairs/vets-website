import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import recordEvent from 'platform/monitoring/record-event';
import formConfig from './config/form';

export default function PreNeedApp({ loading, location, children }) {
  // find all yes/no check boxes and attach analytics events
  useEffect(
    () => {
      if (!loading) {
        const radios = document.querySelectorAll('input[type="radio"]');
        for (const radio of radios) {
          radio.onclick = e => {
            const label = e.target.nextElementSibling.innerText;
            recordEvent({
              event: 'int-radio-button-option-click',
              'radio-button-label': label,
              'radio-button-optionLabel': e.target.value,
              'radio-button-required': e.target.required,
            });
          };
        }
      }
    },
    [loading, location],
  );
  return (
    <article id="pre-need" data-location={`${location?.pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );
}

PreNeedApp.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.object,
  location: PropTypes.object,
};
