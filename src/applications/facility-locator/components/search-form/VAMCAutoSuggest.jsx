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
  const comboBoxRef = useRef(null);

  useEffect(() => {
    const comboBox = comboBoxRef.current?.shadowRoot;
    const handleInput = event => {
      // console.log('event: ', event.target.value);
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
      console.log('allServices: ', allServices);
      return allServices.map((match, index) => {
        return createDropdownOption(match, index);
      });
    },
    [allServices],
  );

  useEffect(
    () => {
      const seeAll = (
        <option key="health" value="health">
          All VA health services
        </option>
      );

      if (!serviceType) {
        // console.log('or this is happening');
        setOptions([seeAll, ...createAllServiceOptions()]);
      } else {
        // console.log('this is happening');
        const filteredServices =
          serviceTypeFilter(serviceType, FACILITY_TYPE_FILTERS.VAMC) ||
          allServices;

        if (filteredServices?.length) {
          // console.log(
          //   'filteredServices: ',
          //   filteredServices[0],
          //   filteredServices[1],
          // );

          const dropdownOptions = filteredServices.map((match, index) => {
            // console.log('match: ', match);
            return createDropdownOption(match.hasdatum, index);
          });
          console.log('dropdownOptions: ', [seeAll, ...dropdownOptions]);
          setOptions([seeAll, ...dropdownOptions]);
        }
      }
    },
    [serviceType],
  );

  // console.log('serviceType: ', serviceType);
  // console.log('options: ', options);

  return (
    <VaComboBox
      class="vads-u-margin-bottom--3"
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
