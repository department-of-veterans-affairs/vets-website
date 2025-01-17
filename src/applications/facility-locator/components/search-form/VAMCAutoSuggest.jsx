import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaComboBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useServiceType from '../../hooks/useServiceType';

const VAMCAutoSuggest = () => {
  const [serviceType, setServiceType] = useState('');

  useEffect(() => {
    const comboBox = document?.querySelector('va-combo-box');
    const handleInput = event => {
      setServiceType(event.target.value);
    };

    setTimeout(() => {
      const input = comboBox.shadowRoot?.querySelector('input');
      
      console.log('input: ', input);
    }, [500])

    const observer = new MutationObserver(() => {

    //   if (input) {
    //     input.addEventListener('input', handleInput);
    //     console.log('Input found and event listener attached.');

    //     observer.disconnect();
    //   }
    // });

    // observer.observe(comboBox, { childList: true, subtree: true });

    // return () => {
    //   observer.disconnect();

    //   const input = comboBox.shadowRoot?.querySelector('input');

    //   if (input) {
    //     input.removeEventListener('input', handleInput);
    //   }
    // };
  }, []);

  return (
    <VaComboBox
      label="Service type"
      name="service-type"
      onVaSelect={e => {
        // console.log('e: ', e);
        // setServiceType(e);
      }}
      onKeyDown={e => {
        // console.log(e);
      }}
      required
      value={serviceType}
    />
  );
};

VAMCAutoSuggest.propTypes = {};

export default VAMCAutoSuggest;
