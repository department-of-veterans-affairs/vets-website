import PropTypes from 'prop-types';
import React from 'react';

const SelectField = ({ id, label, value, onChange, options }) => (
  <>
    <label
      htmlFor={id}
      className="vads-u-text-align--left vads-u-font-size--md vads-u-margin-top--2"
    >
      {label}
    </label>
    <select id={id} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">- Select -</option>
      {options.map(({ id: optionId, label: optionLabel }) => (
        <option key={optionId} value={optionId}>
          {optionLabel}
        </option>
      ))}
    </select>
  </>
);

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectField;
