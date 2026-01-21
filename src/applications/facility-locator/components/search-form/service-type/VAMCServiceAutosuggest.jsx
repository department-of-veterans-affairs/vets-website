import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { useCombobox } from 'downshift-v9';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

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
  const [defaultHighlightedIndex, setDefaultHighlightedIndex] = useState(0);

  const inputRef = useRef(null);

  // Use a ref to track inputValue without triggering effect re-runs
  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;

  const getServices = useCallback(
    input => {
      const services = serviceTypeFilter(
        input || null,
        FACILITY_TYPE_FILTERS.VAMC,
      ); 
      if (!services?.length) {
        setOptions([
          {
            id: 'no-items',
            isError: true,
            toDisplay: 'No matching services found.',
            disabled: true,
          },
          allVAMCServices?.[0],
        ]);
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
      } else if (inputValueRef.current && committedServiceDisplay === null) {
        // Clear input when committedServiceDisplay is explicitly null
        // This happens when user changes facility type
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
  // The searchInitiated variable is only used for this purpose so we reset it at the bottom
  useEffect(
    () => {
      if (searchInitiated) {
        const currentInputValue = inputValueRef.current;
        const selectedValueFromDropdown = options?.filter(
          service => service.toDisplay === currentInputValue,
        )?.[0];

        const typedValueHasNoMatch =
          currentInputValue?.length &&
          currentInputValue !== selectedValueFromDropdown?.toDisplay;

        if (typedValueHasNoMatch || !currentInputValue) {
          // Find the "All VA health services" option to get its serviceId
          const allServicesOption = options?.find(
            service => service.id === 'All VA health services',
          );

          setInputValue('All VA health services');

          // Update form state so URL params include the service type
          if (onDraftChange && allServicesOption) {
            onDraftChange({
              serviceType: allServicesOption.serviceId,
              vamcServiceDisplay: allServicesOption.toDisplay,
            });
          }
        }
      }

      setSearchInitiated(false);
    },
    [options, searchInitiated, setSearchInitiated, onDraftChange],
  );

  useEffect(
    () => {
      if (options?.[0]?.disabled && inputValue) {
        setDefaultHighlightedIndex(1);
      } else {
        setDefaultHighlightedIndex(
          options?.length
            ? options.findIndex(o => o.toDisplay === inputValue)
            : 0,
        );
      }
    },
    [options, inputValue],
  );

  const handleClearClick = () => {
    setInputValue(null);
    setOptions(allVAMCServices);

    if (onDraftChange) {
      onDraftChange({ serviceType: null, vamcServiceDisplay: null });
    }

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
      } else if (userInput.length === 0) {
        handleClearClick();
        setDefaultHighlightedIndex(0);
        setOptions(allVAMCServices);
      } else {
        setOptions(allVAMCServices);
      }

      if (!userInput) {
        handleClearClick();
      }
    } else if (
      e.type === useCombobox.stateChangeTypes.ItemClick &&
      e.selectedItem === undefined
    ) {
      setOptions(allVAMCServices);
      setInputValue(allVAMCServices?.[0]?.toDisplay);
      onChange({
        serviceType: allVAMCServices?.[0]?.serviceId,
        vamcServiceDisplay: allVAMCServices?.[0]?.toDisplay,
      });
    }
  };

  const handleDropdownSelection = event => {
    const { selectedItem } = event;
    if (selectedItem?.toDisplay) {
      setInputValue(selectedItem.toDisplay);

      if (onDraftChange) {
        onDraftChange({
          serviceType: selectedItem.serviceId,
          vamcServiceDisplay: selectedItem.toDisplay,
        });
      }
    }
  };

  return (
    <Autosuggest
      defaultHighlightedIndex={defaultHighlightedIndex}
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      handleOnSelect={handleDropdownSelection}
      hintText="Begin typing to search for a service, like vision or dental"
      initialSelectedItem={options?.[defaultHighlightedIndex]}
      inputId="vamc-services"
      inputRef={inputRef}
      inputValue={inputValue || ''}
      keepDataOnBlur
      label={<span>Service type</span>}
      noItemsMessage="No matching services found."
      onClearClick={handleClearClick}
      onInputValueChange={handleInputValueChange}
      options={options}
      showDownCaret
      showError={false}
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
