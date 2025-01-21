import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaComboBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../hooks/useServiceType';

const VAMCAutoSuggest = ({ handleServiceTypeChange }) => {
  const { allOptions, serviceTypeFilter } = useServiceType();
  const [serviceType, setServiceType] = useState('');
  const [matches, setMatches] = useState(allOptions);
  const comboBoxRef = useRef(null);

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
      if (!serviceType) {
        setMatches(allOptions);
      } else {
        setMatches(
          serviceTypeFilter(serviceType, FACILITY_TYPE_FILTERS.VAMC) ||
            allOptions,
        );
      }
    },
    [serviceType],
  );

  const makeOptionsFromMatches = () => {
    const seeAll = (
      <option key="A" value="health">
        All VA health services
      </option>
    );

    const matchedServices = matches.map((match, index) => {
      return (
        <option key={index} value={match[0]}>
          {match[0]}
        </option>
      );
    });

    return [seeAll, ...matchedServices];
  };

  return (
    <VaComboBox
      label="Service type"
      name="service-type"
      onVaSelect={e => handleServiceTypeChange(e.detail.value)}
      ref={comboBoxRef}
      required
      value={serviceType}
    >
      {makeOptionsFromMatches()}
    </VaComboBox>
  );
};

VAMCAutoSuggest.propTypes = {
  handleServiceTypeChange: PropTypes.func.isRequired,
};

export default VAMCAutoSuggest;
