import React, { useCallback, useEffect, useState } from 'react';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

const VAMCServiceAutosuggest = ({
  handleServiceTypeChange,
  selectedServiceType,
}) => {
  const { serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [options, setOptions] = useState([]);
  const [showServicesError, setShowServicesError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const services = serviceTypeFilter(null, FACILITY_TYPE_FILTERS.VAMC);

  useEffect(
    () => {
      // console.log('services: ', services);

      if (!options?.length && services?.length) {
        const serviceOptions = services.map(service => {
          let displayName = service?.[0];

          if (displayName && service?.[1]) {
            displayName = `${displayName} (${service?.[1]})`;
          } else if (!displayName) {
            return null;
          }

          return {
            id: service[0],
            toDisplay: displayName,
          };
        });

        if (serviceOptions?.length) {
          setOptions(serviceOptions);
        }
      }
    },
    [services],
  );

  const handleClearClick = useCallback(
    () => {
      //     // onClearClick(); // clears searchString in redux
      //     // onChange({ searchString: '' });
      //     setInputValue('');
      //     // setting to null causes the the searchString to be used, because of a useEffect below
      //     // so we set it to a non-existent object
      //     setSelectedItem(null);
      //     setOptions([]);
    },
    //   // [onClearClick, onChange],
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

  // console.log('options: ', options.length);

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
      handleOnSelect={() => {}}
      inputError={false}
      // inputError={<p>Error</p>}
      inputId="vamc-services"
      inputValue={serviceType || ''}
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
      selectedItem={selectedServiceType}
      showDownCaret
      showError={showServicesError}
    />
  )
};

export default VAMCServiceAutosuggest;
