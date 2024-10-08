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
        return (
          <div className="row" key={index}>
            <Dropdown
              disabled={false}
              label={capitalizeFirstLetter(dropdown.label)}
              visible
              name={dropdown.label}
              options={dropdown.options}
              value={dropdown.current.optionValue}
              onChange={handleChange}
              alt={dropdown.alt}
              selectClassName="lc-dropdown-filter"
            />
          </div>
        );
      })}
    </>
  );
}

export default LicenseCertificationSearchFields;
