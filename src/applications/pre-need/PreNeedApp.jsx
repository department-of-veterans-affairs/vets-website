import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import recordEvent from 'platform/monitoring/record-event';
import { useSelector } from 'react-redux';
import formConfig from './config/form';

export default function PreNeedApp({ loading, location, children }) {
  const selectorData = useSelector(state => state.form || {});
  const [data, setData] = useState(selectorData);
  // find all yes/no check boxes and attach analytics events
  useEffect(
    () => {
      setData(selectorData);
      const radios = document.querySelectorAll('input[type="radio"], va-radio');

      for (const radio of radios) {
        radio.onclick = e => {
          const name = e.target.attributes.name.value;
          let optionalLabel = e.target.nextElementSibling.innerHTML;

          // conditional to remove PII on page 5/6 of 6/7
          if (
            name ===
            'root_application_applicant_applicantRelationshipToClaimant'
          ) {
            if (optionalLabel === 'Someone else, such as a preparer')
              optionalLabel = 'Authorized Agent/Rep';
            else optionalLabel = 'Self';
          }
          // prevents the bug involving Va radios and regular radio buttons producing double event logging
          const currentEvent = {
            event: 'int-radio-option-click',
            'radio-button-label': name,
            'radio-button-optionLabel': optionalLabel,
            'radio-button-required': true,
          };
          const priorEvent = window.dataLayer[window.dataLayer.length - 1];
          // if prior event is identical to current event it must be a duplicate.
          if (
            !priorEvent ||
            JSON.stringify(currentEvent) !== JSON.stringify(priorEvent)
          )
            recordEvent({
              event: 'int-radio-option-click',
              'radio-button-label': name,
              'radio-button-optionLabel': optionalLabel,
              'radio-button-required': true,
            });
        };
      }
    },
    [loading, location, selectorData, data],
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
  children: PropTypes.object,
  location: PropTypes.object,
};
