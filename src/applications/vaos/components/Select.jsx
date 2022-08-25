import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function Select({ onChange, options, id, label, value }) {
  const selectOptions = options.map((o, index) => {
    return (
      <option
        key={`selected-${index}`}
        value={o.value}
        className="vads-u-font-weight--normal"
      >
        {o.label}
      </option>
    );
  });

  return (
    <VaSelect
      name={id}
      id={id}
      label={label ?? 'Select'}
      onVaSelect={onChange}
      className="usa-select vads-u-margin-bottom--1p5"
      value={value}
      data-testid="vaosSelect"
    >
      {selectOptions}
    </VaSelect>
  );
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  // eslint-disable-next-line react/sort-prop-types
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default Select;
