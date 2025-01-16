import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaComboBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useServiceType from '../../hooks/useServiceType';

const VAMCAutoSuggest = () => {
  const [serviceType, setServiceType] = useState('');

  console.log('serviceType: ', serviceType);

  useEffect(() => {
    if (document) {
      const comboBoxInput = document.querySelector(
        '.usa-combo-box [role="combobox"]',
      );

      if (comboBoxInput) {
        console.log('comboBoxInput: ', comboBoxInput.value);
      }
    }
    // if (serviceType && serviceType?.length > 2) {
    //   console.log('matches: ', useServiceType.serviceTypeFilter(serviceType));
    // }
  }, []);

  return (
    <VaComboBox
      label="Service type"
      name="service-type"
      onVaSelect={e => {
        console.log('e: ', e);
        // setServiceType(e);
      }}
      onKeyDown={e => {
        console.log(e);
      }}
      required
      value={serviceType}
    />
  );
};

VAMCAutoSuggest.propTypes = {};

export default VAMCAutoSuggest;
