import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

const VAMCServiceAutosuggest = ({
  onChange,
  searchInitiated,
  setSearchInitiated,
}) => {
  const { serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [options, setOptions] = useState([]);
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
      const availableOptions = [allServicesOption, ...serviceOptions];

      setOptions(availableOptions);

      if (!allVAMCServices?.length) {
        setAllVAMCServices(availableOptions);
      }
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  // If the user has not typed a service at all, or types something that does not
  // match any of the services, we'll search for "All VA health services" when the
  // search button is clicked. This just prefills the input with that text so it won't
  // be a confusing experience for the user.
  // The searchInitiated variable is only used for this purpose so we reset it at the bottom
  useEffect(
    () => {
      const displayOptions = options?.map(service => service.toDisplay);
      const typedValueHasNoMatch =
        inputValue?.length && !displayOptions.includes(inputValue);

      if (searchInitiated && (typedValueHasNoMatch || !inputValue)) {
        setInputValue('All VA health services');
      }

      setSearchInitiated(false);
    },
    [inputValue, options, searchInitiated],
  );

  const handleClearClick = useCallback(
    () => {
      onChange({ serviceType: null });
      setInputValue(null);
      setSelectedService(null);
      setOptions(allVAMCServices);
    },
    [allVAMCServices, onChange],
  );

  const handleServiceTypeChange = e => {
    setInputValue(e.inputValue?.trimStart());

    if (e.inputValue?.length >= 2) {
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
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      handleOnSelect={handleServiceTypeSelection}
      initialSelectedItem={allServicesOption}
      errorMessage={null}
      inputId="vamc-services"
      inputValue={inputValue || ''}
      keepDataOnBlur
      /* eslint-disable prettier/prettier */
      label="Service type"
      noItemsMessage="No results found. Search for a different service."
      onClearClick={handleClearClick}
      onInputValueChange={handleServiceTypeChange}
      options={options}
      selectedItem={selectedService}
      showDownCaret
      showError={false}
      shouldShowNoResults
    />
  )
};

VAMCServiceAutosuggest.propTypes = {
  searchInitiated: PropTypes.bool,
  setSearchInitiated: PropTypes.func,
  onChange: PropTypes.func,
}

export default VAMCServiceAutosuggest;
