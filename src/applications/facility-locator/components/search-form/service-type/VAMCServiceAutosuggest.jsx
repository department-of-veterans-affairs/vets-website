import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { useCombobox } from 'downshift-v9';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

const ALL_VA_HEALTH_SERVICES = 'All VA health services';

const VAMCServiceAutosuggest = ({
  committedServiceDisplay,
  searchInitiated,
  setSearchInitiated,
  onDraftChange,
}) => {
  const { selector, serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [allVAMCServices, setAllVAMCServices] = useState([]);
  const inputRef = useRef(null);

  // Track inputValue via ref for the committedServiceDisplay effect,
  // which needs to check inputValue without re-running when it changes
  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;

  const getServices = useCallback(
    input => {
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
        setOptions(serviceOptions);
        setAllVAMCServices(prev => (prev.length ? prev : serviceOptions));
      }
    },
    [serviceTypeFilter],
  );

  // Initialize services when selector data becomes available
  useEffect(
    () => {
      if (selector?.data && !allVAMCServices.length) {
        getServices();
      }
    },
    [selector, allVAMCServices.length, getServices],
  );

  // Handles edge cases where the form might be re-rendered between
  // viewpoints or for any other reason and the autosuggest input is lost.
  // Also clears input when committedServiceDisplay becomes null (e.g., facility type change)
  useEffect(
    () => {
      if (committedServiceDisplay) {
        // Only set if input is currently empty to avoid overwriting user input
        if (!inputValueRef.current) {
          setInputValue(committedServiceDisplay);
        }
      } else if (
        inputValueRef.current &&
        committedServiceDisplay === null &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        // Clear input when committedServiceDisplay is explicitly null
        // This happens when user changes facility type
        // Only clear if the input field is not currently focused (prevents clearing mid-typing)
        setInputValue(null);
        setOptions(allVAMCServices);
      }
    },
    [committedServiceDisplay, allVAMCServices],
  );

  // If the user has not typed a service at all, or types something that does not
  // match any of the services, we'll search for "All VA health services" when the
  // search button is clicked. This prefills the input and updates the form state
  // so the URL params reflect the actual service type being searched.
  useEffect(
    () => {
      if (!searchInitiated) return;

      const matchedService = options.find(
        service => service.toDisplay === inputValue,
      );

      if (!matchedService) {
        const allServicesOption = options.find(
          service => service.id === ALL_VA_HEALTH_SERVICES,
        );

        setInputValue(ALL_VA_HEALTH_SERVICES);

        if (onDraftChange && allServicesOption) {
          onDraftChange({
            serviceType: allServicesOption.serviceId,
            vamcServiceDisplay: allServicesOption.toDisplay,
          });
        }
      }

      setSearchInitiated(false);
    },
    [options, searchInitiated, inputValue, onDraftChange, setSearchInitiated],
  );

  const handleClearClick = () => {
    setInputValue(null);
    setOptions(allVAMCServices);

    onDraftChange?.({ serviceType: null, vamcServiceDisplay: null });

    if (inputRef?.current) {
      focusElement(inputRef.current);
    }
  };

  const handleInputValueChange = e => {
    // The autosuggest component runs both handleOnSelect and onInputValueChange
    // when a dropdown value is selected. This creates problems for this component,
    // so we limit this function's purpose to only handle typing and not selection
    if (e.type === useCombobox.stateChangeTypes.InputChange) {
      const userInput = e.inputValue?.trimStart();
      setInputValue(userInput);

      const selectedItemId = e?.selectedItem?.id;
      const selectedItemDisplay = e?.selectedItem?.toDisplay;

      if (userInput.length >= 2) {
        getServices(
          selectedItemDisplay === e.inputValue ? selectedItemId : e.inputValue,
        );
      } else {
        setOptions(allVAMCServices);
      }

      if (!userInput) {
        handleClearClick();
      }
    }
  };

  const handleDropdownSelection = event => {
    const { selectedItem } = event;

    if (selectedItem?.toDisplay) {
      setInputValue(selectedItem.toDisplay);

      onDraftChange?.({
        serviceType: selectedItem.serviceId,
        vamcServiceDisplay: selectedItem.toDisplay,
      });
    }
  };

  useEffect(
    () => {
      if (!isMobile) return undefined;
      const servicesTypeInput = document.getElementById('vamc-services');
      if (!servicesTypeInput) return undefined;

      const handleFocus = () => {
        const servicesTypeContainer = document.getElementById(
          'vamc-services-autosuggest-container',
        );
        if (!servicesTypeContainer) return;

        setTimeout(() => {
          servicesTypeContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 300);
      };

      servicesTypeInput.addEventListener('focus', handleFocus);
      return () => servicesTypeInput.removeEventListener('focus', handleFocus);
    },
    [isMobile],
  );
  return (
    <Autosuggest
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      handleOnSelect={handleDropdownSelection}
      hintText="Begin typing to search for a service, like vision or dental"
      initialSelectedItem={options?.[0]}
      inputId="vamc-services"
      inputRef={inputRef}
      inputValue={inputValue || ''}
      keepDataOnBlur
      label={<span>Service type</span>}
      noItemsMessage="No results found."
      onClearClick={handleClearClick}
      onInputValueChange={handleInputValueChange}
      options={options}
      showDownCaret
      showError={false}
      shouldShowNoResults
    />
  );
};

VAMCServiceAutosuggest.propTypes = {
  committedServiceDisplay: PropTypes.string,
  searchInitiated: PropTypes.bool,
  setSearchInitiated: PropTypes.func,
  onDraftChange: PropTypes.func,
};

export default VAMCServiceAutosuggest;
