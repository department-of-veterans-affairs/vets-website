import React from 'react';
import Dropdown from './Dropdown';

// TODO - check for existing helper function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function LicenseCertificationSearchFields({ dropdowns, handleChange }) {
  return (
    <>
      <div className="row">
        <va-text-input label="License/Certification Name" />
      </div>
      {dropdowns.map((dropdown, index) => {
        const { label, options, current, alt } = dropdown;

        return (
          <div className="row" key={index}>
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
    </>
  );
}

export default LicenseCertificationSearchFields;
