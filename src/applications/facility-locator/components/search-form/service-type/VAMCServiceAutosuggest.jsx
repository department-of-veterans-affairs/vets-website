import React, { useCallback, useEffect, useState } from 'react';
import { stubFalse } from 'lodash';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

const VAMCServiceAutosuggest = ({
  handleServiceTypeChange,
  selectedServiceType,
}) => {
  const { allServices, serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [options, setOptions] = useState(null);
  const [showServicesError, setShowServicesError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleClearClick = useCallback(
    () => {
      // onClearClick(); // clears searchString in redux
      // onChange({ searchString: '' });
      setInputValue('');
      // setting to null causes the the searchString to be used, because of a useEffect below
      // so we set it to a non-existent object
      setSelectedItem(null);
      setOptions([]);
    },
    // [onClearClick, onChange],
  );

  const createDropdownOption = (match, index) => (
    <option key={index} value={match[0]}>
      {match[0]}
    </option>
  );

  const createAllServiceOptions = useCallback(
    () => {
      return allServices.map((match, index) =>
        createDropdownOption(match, index),
      );
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
        setOptions([seeAll, ...createAllServiceOptions()]);
      } else {
        const filteredServices =
          serviceTypeFilter(serviceType, FACILITY_TYPE_FILTERS.VAMC) ||
          allServices;

        if (filteredServices?.length) {
          const dropdownOptions = filteredServices.map((match, index) =>
            createDropdownOption(match.hsdatum, index),
          );

          setOptions([seeAll, ...dropdownOptions]);
        }
      }
    },
    [allServices, createAllServiceOptions, serviceType, serviceTypeFilter],
  );

  return (
    <Autosuggest
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      handleOnSelect={() => {}}
      inputError={() => {}}
      inputValue={serviceType || ''}
      isLoading={stubFalse}
      keepDataOnBlur
      /* eslint-disable prettier/prettier */
      label={(
        <>
          <span>Service type</span>{' '}
          <span className="form-required-span">(*Required)</span>
        </>
      )}
      loadingMessage="Searching..."
      minCharacters={1}
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
