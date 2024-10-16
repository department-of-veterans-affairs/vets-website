import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';

// TODO - check for existing helper function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function LicenseCertificationSearchForm({
  handleChange,
  handleSearch,
  dropdowns,
}) {
  return (
    <form>
      <div>
        <va-text-input label="License/Certification Name" />
      </div>
      {dropdowns.map((dropdown, index) => {
        const { label, options, current, alt } = dropdown;

        return (
          <div key={index}>
            <Dropdown
              disabled={false}
              label={capitalizeFirstLetter(label)}
              visible
              name={label}
              options={options}
              value={current.optionValue}
              onChange={handleChange}
              alt={alt}
              selectClassName="lc-dropdown-filter"
              required={label === 'country' || label === 'category'}
            />
          </div>
        );
      })}
      <div className="button-wrapper row vads-u-padding-y--6">
        <va-button text="Submit" onClick={handleSearch} />
      </div>
    </form>
  );
}

LicenseCertificationSearchForm.propTypes = {
  dropdowns: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};
