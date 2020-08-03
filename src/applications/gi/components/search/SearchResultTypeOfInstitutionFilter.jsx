import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

function SearchResultTypeOfInstitutionFilter({
  category,
  onChange,
  handleInputFocus,
  gibctFilterEnhancement,
}) {
  const options = [
    {
      value: 'ALL',
      label: 'All',
    },
    {
      value: 'school',
      label: 'Schools only',
    },
    {
      value: 'employer',
      label: 'Employers only (OJT, apprenticeships)',
    },
  ];

  return (
    <RadioButtons
      label={
        gibctFilterEnhancement
          ? 'Select an institution type'
          : 'Type of institution'
      }
      name="category"
      options={options}
      value={category}
      onChange={onChange}
      onFocus={handleInputFocus}
    />
  );
}

SearchResultTypeOfInstitutionFilter.propTypes = {
  category: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleInputFocus: PropTypes.func,
};

export default SearchResultTypeOfInstitutionFilter;
