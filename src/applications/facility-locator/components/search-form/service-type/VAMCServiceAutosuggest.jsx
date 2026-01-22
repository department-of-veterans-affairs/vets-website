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
  onChange,
}) => {
  const { selector, serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [allVAMCServices, setAllVAMCServices] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

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

      const noOptions = [
        {
          id: 'no-items',
          isError: true,
          toDisplay: 'No matching services found.',
          disabled: true,
        },
        allVAMCServices?.[0],
      ];

      if (!services?.length) {
        setOptions(noOptions);
        setSelectedItem(noOptions?.[1]);
        return;
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
      } else {
        setOptions(noOptions);
        setSelectedItem(noOptions?.[1]);
      }
    },
    [serviceTypeFilter, allVAMCServices],
  );

  const handleClearClick = useCallback(
    () => {
      setInputValue('');
      setSelectedItem(null);
      setOptions(allVAMCServices);

      onChange?.({
        serviceType: null,
        vamcServiceDisplay: null,
      });

      if (inputRef?.current) {
        focusElement(inputRef.current);
      }
    },
    [allVAMCServices, onChange],
  );

  const handleInputValueChange = useCallback(
    e => {
      // The autosuggest component runs both handleOnSelect and onInputValueChange
      // when a dropdown value is selected. This creates problems for this component,
      // so we limit this function's purpose to only handle typing and not selection
      if (
        e.type === useCombobox.stateChangeTypes.InputChange ||
        e.type ===
          useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem
      ) {
        const userInput = e.inputValue?.trimStart();
        setInputValue(userInput);

        const selectedItemId = e?.selectedItem?.id;
        const selectedItemDisplay = e?.selectedItem?.toDisplay;
        if (userInput.length >= 2) {
          getServices(
            selectedItemDisplay === e.inputValue
              ? selectedItemId
              : e.inputValue,
          );
        } else if (userInput.length === 0) {
          handleClearClick();
          setOptions(allVAMCServices);
          return;
        } else {
          setOptions(allVAMCServices);
          return;
        }

        if (!userInput) {
          handleClearClick();
        }
        return;
      }
      if (e?.selectedItem?.toDisplay) {
        setInputValue(e?.selectedItem?.toDisplay || '');
        setSelectedItem(e?.selectedItem || null);
        onChange?.({
          serviceType: e?.selectedItem?.serviceId || null,
          vamcServiceDisplay: e?.selectedItem?.toDisplay || null,
        });
        return;
      }
      handleClearClick();
    },
    [allVAMCServices, getServices, handleClearClick, onChange],
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
  // viewpoints or for any other reason and the autosuggest input is lost
  useEffect(
    () => {
      if (!inputValueRef.current && committedServiceDisplay) {
        setInputValue(
          allVAMCServices.find(
            service => service.serviceId === committedServiceDisplay,
          )?.toDisplay || '',
        );
      }
    },
    [committedServiceDisplay, allVAMCServices],
  );

  // If the user has not typed a service at all, or types something that does not
  // match any of the services, we'll search for "All VA health services" when the
  // search button is clicked. This just prefills the input with that text so it won't
  // be a confusing experience for the user.
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
          setInputValue('All VA health services');
        }
      }

      setSearchInitiated(false);
    },
    [options, searchInitiated, setSearchInitiated],
  );

  return (
    <Autosuggest
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      hintText="Begin typing to search for a service, like vision or dental"
      selectedItem={selectedItem}
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
  initialInputValue: PropTypes.string,
  searchInitiated: PropTypes.bool,
  setSearchInitiated: PropTypes.func,
  onChange: PropTypes.func,
};

export default VAMCServiceAutosuggest;
