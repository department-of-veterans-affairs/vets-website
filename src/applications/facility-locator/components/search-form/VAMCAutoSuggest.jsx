import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaComboBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../hooks/useServiceType';

const VAMCAutoSuggest = ({ handleServiceTypeChange }) => {
  const { allServices, serviceTypeFilter } = useServiceType();
  const [serviceType, setServiceType] = useState('');
  const [options, setOptions] = useState();
  const [inputError, setInputError] = useState(null);
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

  const createDropdownOption = (match, index) => (
    <option key={index} value={match[0]}>
      {match[0]}
    </option>
  );

  const createAllServiceOptions = useCallback(
    () => {
      return allServices.map((match, index) => {
        return createDropdownOption(match, index);
      });
    },
    [allServices],
  );

  useEffect(
    () => {
      const seeAll = (
        <option key="A" value="health">
          All VA health services
        </option>
      );

      if (!serviceType) {
        setOptions([seeAll, ...createAllServiceOptions()]);
      } else {
        const filteredServices =
          serviceTypeFilter(serviceType, FACILITY_TYPE_FILTERS.VAMC) ||
          allServices;

        if (filteredServices?.length) {
          const dropdownOptions = filteredServices.map((match, index) => {
            return createDropdownOption(match, index);
          });

          setOptions([seeAll, ...dropdownOptions]);
        } else {
          setInputError('No results found. Search for a different service.');
        }
      }
    },
    [serviceType],
  );

  return (
    <VaComboBox
      error={inputError}
      label="Service type"
      name="service-type"
      onVaSelect={e => handleServiceTypeChange(e.detail.value)}
      ref={comboBoxRef}
      required
      value={serviceType}
    >
      {options}
    </VaComboBox>
  );
};

VAMCAutoSuggest.propTypes = {
  handleServiceTypeChange: PropTypes.func.isRequired,
};

export default VAMCAutoSuggest;
