import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

function GenderFilter({ filters, onChange, onFocus }) {
  const options = [
    {
      value: 'Any',
      label: 'Any',
    },
    {
      value: 'womenonly',
      label: 'Women only',
    },
    {
      value: 'menonly',
      label: 'Men only',
    },
  ];

  let value = options[0].value;
  if (filters.womenonly && filters.menonly) {
    value = options[0].value;
  } else if (filters.womenonly) {
    value = 'womenonly';
  } else if (filters.menonly) {
    value = 'menonly';
  }

  return (
    <RadioButtons
      label="Gender"
      name="gender"
      options={options}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
    />
  );
}

GenderFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func,
};

export default GenderFilter;
