import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import '@department-of-veterans-affairs/component-library/dist/main.css';
import { useFocusHeading } from '../hooks/useFocusHeading';

const RadioOptions = ({
  config,
  title,
  onContinue,
  onBack,
  onOptionChange,
  currentSubtask,
  showBack,
  selectedValues,
}) => {
  useFocusHeading({ shadowOnly: true });

  const [selectedValue, setSelectedValue] = useState(
    selectedValues?.[currentSubtask] || null,
  );

  useEffect(
    () => {
      setSelectedValue(selectedValues?.[currentSubtask] || null);
    },
    [currentSubtask, selectedValues],
  );

  const handleCustomEvent = event => {
    if (event.target.tagName.toLowerCase() === 'va-radio') {
      const selected = config.find(
        option => option.value === event.detail.value,
      );
      if (selected) {
        setSelectedValue(selected.value);
        if (onOptionChange) {
          onOptionChange(selected.value);
        }
      }
    }
  };

  useEffect(
    () => {
      document.addEventListener('vaValueChange', handleCustomEvent);
      return () => {
        document.removeEventListener('vaValueChange', handleCustomEvent);
      };
    },
    [config, onOptionChange],
  );

  const handleContinue = () => {
    if (selectedValue && onContinue) {
      onContinue(selectedValue);
    }
  };

  return (
    <>
      <va-radio
        label={title}
        name="navigationOptions"
        required
        label-header-level="1"
        value={selectedValue}
      >
        {config.map(option => (
          <va-radio-option
            key={option.value}
            name="navigationOptions"
            label={option.label}
            value={option.value}
            description={option.description}
            checked={option.value === selectedValue}
          />
        ))}
      </va-radio>

      <div className="vads-u-margin-top--2">
        <VaButtonPair
          continue
          onPrimaryClick={handleContinue}
          onSecondaryClick={onBack}
          primaryDisabled={!selectedValue}
          secondaryVisible={showBack}
        />
      </div>
    </>
  );
};

RadioOptions.propTypes = {
  config: PropTypes.array.isRequired,
  currentSubtask: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  selectedValues: PropTypes.object,
  showBack: PropTypes.bool,
  onOptionChange: PropTypes.func,
};

export default RadioOptions;
