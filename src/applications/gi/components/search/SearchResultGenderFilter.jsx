import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

function SearchResultGenderFilter({ gender, onChange, handleInputFocus }) {
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

  return (
    <RadioButtons
      label="Gender"
      name="gender"
      options={options}
      value={gender}
      onChange={onChange}
      onFocus={handleInputFocus}
    />
  );
}

SearchResultGenderFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func,
};

export default SearchResultGenderFilter;
