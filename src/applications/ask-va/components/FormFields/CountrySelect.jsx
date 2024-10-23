import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { countries } from '@department-of-veterans-affairs/platform-forms/address';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const CountrySelect = props => {
  const { id, onChange, value, formData } = props;

  const handleChange = event => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  return (
    <VaSelect
      id={id}
      name={id}
      value={value}
      disabled={formData.onBaseOutsideUS}
      onVaSelect={handleChange}
    >
      {countries.map(country => (
        <option key={country.value} value={country.value} id={country.value}>
          {country.label}
        </option>
      ))}
    </VaSelect>
  );
};

CountrySelect.propTypes = {
  formData: PropTypes.object,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(mapStateToProps)(CountrySelect);
