import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

const VAMCServiceAutosuggest = ({ onChange, selectedServiceType }) => {
  const { serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [options, setOptions] = useState([]);
  const [showServicesError, setShowServicesError] = useState(false);

  const getServices = input => {
    console.log('input: ', input);
    const services = serviceTypeFilter(
      input || null,
      FACILITY_TYPE_FILTERS.VAMC,
    );

    if (services?.length) {
      const serviceOptions = services.map(service => {
        let displayName = service?.[0];

        if (displayName && service?.[1]) {
          displayName = `${displayName} (${service?.[1]})`;
        } else if (!displayName) {
          return null;
        }

        return {
          id: service[0],
          serviceId: service[3],
          toDisplay: displayName,
        };
      });

      // console.log('serviceOptions: ', serviceOptions);

      if (serviceOptions?.length) {
        setOptions(serviceOptions);
      }
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const handleClearClick = useCallback(
    () => {
      onChange({ serviceType: null });
      setInputValue(null);
      setSelectedService(null);
      setOptions([]);
    },
    [onChange],
  );

  // const createAllServiceOptions = useCallback(
  //   () => {
  //     return allServices.map((match, index) =>
  //       createDropdownOption(match, index),
  //     );
  //   },
  //   [allServices],
  // );

  // useEffect(
  //   () => {
  //     const seeAll = (
  //       <option key="health" value="health">
  //         All VA health services
  //       </option>
  //     );

  //     if (!serviceType) {
  //       setOptions([seeAll, ...createAllServiceOptions()]);
  //     } else {
  //       const filteredServices =
  //         serviceTypeFilter(serviceType, FACILITY_TYPE_FILTERS.VAMC) ||
  //         allServices;

  //       if (filteredServices?.length) {
  //         const dropdownOptions = filteredServices.map((match, index) =>
  //           createDropdownOption(match.hsdatum, index),
  //         );

  //         setOptions([seeAll, ...dropdownOptions]);
  //       }
  //     }
  //   },
  //   [allServices, createAllServiceOptions, serviceType, serviceTypeFilter],
  // );

  const handleServiceTypeChange = e => {
    setInputValue(e.inputValue?.trimStart());

    if (inputValue?.length >= 2) {
      getServices(e.inputValue);
    }

    // if (!value?.trimStart()) {
    // onClearClick();
    // }
  };

  const handleServiceTypeSelection = event => {
    const { selectedItem } = event;

    if (selectedItem && selectedItem?.serviceId) {
      onChange({ serviceType: selectedItem.serviceId });
      setSelectedService(selectedItem);
    }
  };

  return (
    <Autosuggest
      defaultSelectedItem={{
        id: 'all',
        toDisplay: 'All VA health services',
      }}
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      handleOnSelect={handleServiceTypeSelection}
      inputError={false}
      // inputError={<p>Error</p>}
      inputId="vamc-services"
      inputValue={inputValue || ''}
      isLoading={false}
      keepDataOnBlur
      /* eslint-disable prettier/prettier */
      label={(
        <>
          <span>Service type</span>{' '}
          <span className="form-required-span">(*Required)</span>
        </>
      )}
      loadingMessage="Searching..."
      minCharacters={2}
      onClearClick={handleClearClick}
      onInputValueChange={handleServiceTypeChange}
      options={options}
      selectedItem={selectedService}
      showDownCaret
      showError={showServicesError}
    />
  )
};

VAMCServiceAutosuggest.propTypes = {
  selectedServiceType: PropTypes.string,
  onChange: PropTypes.func,
}

export default VAMCServiceAutosuggest;
