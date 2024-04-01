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
    <select
      name={id}
      id={id}
      value={value}
      disabled={formData.onBaseOutsideUS}
      onChange={handleChange}
    >
      <option value="">- Select -</option>
      {countries.map(country => (
        <option key={country.value} value={country.value} id={country.value}>
          {country.label}
        </option>
      ))}
    </select>
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
