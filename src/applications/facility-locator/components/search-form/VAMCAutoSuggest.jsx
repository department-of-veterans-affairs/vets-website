import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaComboBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../hooks/useServiceType';

const VAMCAutoSuggest = () => {
  const [serviceType, setServiceType] = useState('');
  const [matches, setMatches] = useState([]);
  const comboBoxRef = useRef(null);
  const serviceFilter = useServiceType().serviceTypeFilter;

  useEffect(() => {
    const comboBox = comboBoxRef.current?.shadowRoot;
    const handleInput = event => {
      setServiceType(event.target.value);
    };

    if (comboBox) {
      comboBox.addEventListener('input', handleInput);
    }

    return () => comboBox.removeEventListener('input', handleInput);
  }, []);

  useEffect(
    () => {
      if (serviceType?.length > 2) {
        setMatches(
          serviceFilter(serviceType, FACILITY_TYPE_FILTERS.VAMC) || [],
        );
      }

      if (serviceType < 3) {
        setMatches([]);
      }
    },
    [serviceFilter, serviceType],
  );

  const makeOptionsFromMatches = () => {
    const seeAll = (
      <option value="health">See results for all VA health services</option>
    );

    if (!matches || !matches.length) {
      return seeAll;
    }

    console.log('matches: ', matches);

    return [
      seeAll,
      ...matches.map(({ hsdatum }) => (
        <option key={hsdatum[3]} value={hsdatum[3]}>
          {hsdatum[0]}
        </option>
      )),
    ];
  };

  return (
    <VaComboBox
      label="Service type"
      name="service-type"
      onVaSelect={e => {
        // console.log('e: ', e);
        // setServiceType(e);
      }}
      ref={comboBoxRef}
      required
      value={serviceType}
    >
      {makeOptionsFromMatches()}
    </VaComboBox>
  );
};

VAMCAutoSuggest.propTypes = {};

export default VAMCAutoSuggest;
