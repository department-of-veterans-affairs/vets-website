import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import useServiceType, {
  FACILITY_TYPE_FILTERS,
} from '../../../hooks/useServiceType';
import Autosuggest from '../autosuggest';

const VAMCServiceAutosuggest = ({
  onChange,
  searchInitiated,
  setSearchInitiated,
  vamcServiceDisplay,
}) => {
  const { selector, serviceTypeFilter } = useServiceType();
  const [inputValue, setInputValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [allVAMCServices, setAllVAMCServices] = useState([]);
  const inputRef = useRef(null);

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
      setOptions(serviceOptions);

      if (!allVAMCServices?.length) {
        setAllVAMCServices(serviceOptions);
      }
    }
  };

  useEffect(
    () => {
      if (selector?.data) {
        getServices();
      }

      // Handles edge cases where the form might be re-rendered between
      // viewpoints or for any other reason and the autosuggest input is lost
      if (!inputValue && vamcServiceDisplay) {
        setInputValue(vamcServiceDisplay);
      }
    },
    [selector],
  );

  // If the user has not typed a service at all, or types something that does not
  // match any of the services, we'll search for "All VA health services" when the
  // search button is clicked. This just prefills the input with that text so it won't
  // be a confusing experience for the user.
  // The searchInitiated variable is only used for this purpose so we reset it at the bottom
  useEffect(
    () => {
      if (searchInitiated) {
        const selectedValueFromDropdown = options?.filter(
          service => service.toDisplay === inputValue,
        )?.[0];

        const typedValueHasNoMatch =
          inputValue?.length &&
          inputValue !== selectedValueFromDropdown?.toDisplay;

        if (typedValueHasNoMatch || !inputValue) {
          setInputValue('All VA health services');
        }
      }

      setSearchInitiated(false);
    },
    [options, searchInitiated],
  );

  const handleClearClick = () => {
    onChange({ serviceType: null, vamcServiceDisplay: null });
    setInputValue(null);
    setOptions(allVAMCServices);

    if (inputRef?.current) {
      focusElement(inputRef.current);
    }
  };

  const handleInputValueChange = e => {
    // The autosuggest component runs both handleOnSelect and onInputValueChange
    // when a dropdown value is selected. This creates problems for this component,
    // so we limit this function's purpose to only handle typing and not selection
    if (e.type === '__input_change__') {
      const userInput = e.inputValue?.trimStart();
      setInputValue(userInput);

      const selectedItemId = e?.selectedItem?.id;
      const selectedItemDisplay = e?.selectedItem?.toDisplay;

      if (userInput.length >= 2) {
        getServices(
          selectedItemDisplay === e.inputValue ? selectedItemId : e.inputValue,
        );
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

      onChange({
        serviceType: selectedItem?.serviceId,
        vamcServiceDisplay: selectedItem.toDisplay,
      });
    }
  };

  return (
    <Autosuggest
      downshiftInputProps={{
        autoCorrect: 'off',
        disabled: false,
        spellCheck: 'false',
      }}
      handleOnSelect={handleDropdownSelection}
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
  searchInitiated: PropTypes.bool,
  setSearchInitiated: PropTypes.func,
  vamcServiceDisplay: PropTypes.string,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  vamcServiceDisplay: state.searchQuery.vamcServiceDisplay,
});

export default connect(mapStateToProps)(VAMCServiceAutosuggest);
