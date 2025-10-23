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
  isRequired = false,
}) => {
  const handleChange = event => {
    const { checked } = event.detail;
    const name = event.target.getAttribute('data-name'); // Retrieve custom attribute
    onChange({ name, checked });
  };

  return (
    <VaCheckboxGroup
      form-heading={title}
      form-heading-level={3}
      label={prompt}
      use-forms-pattern="single"
      onVaChange={handleChange}
      required={isRequired}
      class="vads-u-margin-y--2"
    >
      {options?.map((option, key) => (
        <VaCheckbox
          key={option + key}
          name={option}
          label={option}
          checked={isBoxChecked(option)}
          data-name={option}
          message-aria-describedby={option}
          className="checkbox-list-item"
        />
      ))}
    </VaCheckboxGroup>
  );
};

Checklist.propTypes = {
  isBoxChecked: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  isRequired: PropTypes.bool,
  prompt: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
};

export default Checklist;
