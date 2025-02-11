import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { countries } from '@department-of-veterans-affairs/platform-forms/address';
import PropTypes from 'prop-types';
import React from 'react';

const CountrySelect = props => {
  const { id, onChange, value } = props;

  const handleChange = event => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  return (
    <VaSelect id={id} name={id} value={value} onVaSelect={handleChange}>
      {countries.map(country => (
        <option key={country.value} value={country.value} id={country.value}>
          {country.label}
        </option>
      ))}
    </VaSelect>
  );
};

CountrySelect.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default CountrySelect;
