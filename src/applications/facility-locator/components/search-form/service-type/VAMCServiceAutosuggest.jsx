import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

const VAMCServiceAutosuggest = ({ onChange }) => {
  const { serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [options, setOptions] = useState([]);
  const [showServicesError, setShowServicesError] = useState(false);
  const [allVAMCServices, setAllVAMCServices] = useState([]);

  const allServicesOption = {
    id: 'all',
    toDisplay: 'All VA health services',
  };

  const getServices = input => {
    const services = serviceTypeFilter(
      input || null,
      FACILITY_TYPE_FILTERS.VAMC,
    );

    if (!services?.length) {
      setOptions([]);
    }

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

    if (serviceOptions?.length) {
      setOptions([allServicesOption, ...serviceOptions]);

      if (!allVAMCServices?.length) {
        setAllVAMCServices([allServicesOption, ...serviceOptions]);
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
      setOptions(allVAMCServices);
      setShowServicesError(true);
    },
    [onChange],
  );

  const handleServiceTypeChange = e => {
    setShowServicesError(false);
    setInputValue(e.inputValue?.trimStart());

    if (inputValue?.length >= 2) {
      getServices(e.inputValue);
    }

    if (!e.inputValue?.trimStart()) {
      handleClearClick();
    }
  };

  const handleServiceTypeSelection = event => {
    const { selectedItem } = event;

    if (selectedItem && selectedItem?.serviceId) {
      onChange({
        serviceType: selectedItem.serviceId,
        vamcServiceDisplay: selectedItem.toDisplay,
      });

      setSelectedService(selectedItem);
    }
  };

  return (
    <Autosuggest
      defaultSelectedItem={allServicesOption}
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      handleOnSelect={handleServiceTypeSelection}
      initialSelectedItem={allServicesOption}
      errorMessage="Start typing and select a service type."
      inputId="vamc-services"
      inputValue={inputValue || ''}
      keepDataOnBlur
      /* eslint-disable prettier/prettier */
      label={(
        <>
          <span>Service type</span>{' '}
          <span className="form-required-span">(*Required)</span>
        </>
      )}
      minCharacters={2}
      noItemsMessage="No results found. Search for a different service."
      onClearClick={handleClearClick}
      onInputValueChange={handleServiceTypeChange}
      options={options}
      selectedItem={selectedService}
      showDownCaret
      showError={showServicesError}
      shouldShowNoResults
    />
  )
};

VAMCServiceAutosuggest.propTypes = {
  selectedServiceType: PropTypes.string,
  onChange: PropTypes.func,
}

export default VAMCServiceAutosuggest;
