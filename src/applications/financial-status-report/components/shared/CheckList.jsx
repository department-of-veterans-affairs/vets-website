import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckbox,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const Checklist = ({
  options,
  onChange,
  isBoxChecked,
  prompt = '',
  title = '',
}) => {
  const handleChange = event => {
    const { checked } = event.detail;
    const name = event.target.getAttribute('data-name'); // Retrieve custom attribute
    onChange({ name, checked });
  };

  return (
    <fieldset className="checkbox-list vads-u-margin-y--2">
      <VaCheckboxGroup
        label={title}
        label-header-level="3"
        hint={prompt}
        onVaChange={handleChange}
      >
        {options?.map((option, key) => (
          <VaCheckbox
            key={option + key}
            name={option}
            label={option}
            checked={isBoxChecked(option)}
            data-name={option}
          />
        ))}
      </VaCheckboxGroup>
    </fieldset>
  );
};

Checklist.propTypes = {
  isBoxChecked: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  prompt: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
};

export default Checklist;
