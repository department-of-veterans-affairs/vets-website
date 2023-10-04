/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import recordEvent from 'platform/monitoring/record-event';
import { useSelector } from 'react-redux';
import formConfig from './config/form';
import { getRequiredMap } from './utils/helpers';

export default function PreNeedApp({ loading, location, children }) {
  const selectorData = useSelector(state => state.form || {});
  const [data, setData] = useState(selectorData);
  const [priorEvent, setPriorEvent] = useState();
  // find all yes/no check boxes and attach analytics events
  useEffect(
    () => {
      setData(selectorData);
      const radios = document.querySelectorAll('input[type="radio"], va-radio');
      const totalPages = document.querySelectorAll('va-segmented-progress-bar')[0].total;
      
      for (const radio of radios) {
        radio.onclick = e => {
          const name = e.target.attributes.name.value;
          let optionalLabel = e.target.nextElementSibling.innerHTML;

          const secondLastIndex = name.lastIndexOf(
            '_',
            name.lastIndexOf('_') - 1,
          );
          const requiredMap = getRequiredMap(new Map(), data.pages, '', '');
          const required = requiredMap.has(name.substring(secondLastIndex + 1));

          // conditional to remove PII on page 5/6 of 6/7
          if (
            name ===
              'root_application_applicant_applicantRelationshipToClaimant' &&
            optionalLabel !== 'Someone else, such as a preparer'
          )
          {
            // if total pages is equal to 6, the vet is filling it out. Otherwise, the authorized agent or rep is.
            if (totalPages === 6)
            optionalLabel = 'Self';
            else
            optionalLabel = 'Authorized Agent/Rep';
          }


          // prevents the bug involving Va radios and regular radio buttons producing double event logging
          setPriorEvent({name, optionalLabel, required});
          const currentEvent = {name, optionalLabel, required};

          if(!priorEvent ||  JSON.stringify(currentEvent) !== JSON.stringify(priorEvent))
          recordEvent({
            event: 'int-radio-option-click',
            'radio-button-label': name,
            'radio-button-optionLabel': optionalLabel,
            'radio-button-required': required,
          });
          setPriorEvent({name, optionalLabel, required});

        };
      }
    },
    [loading, location, selectorData, data, priorEvent],
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
