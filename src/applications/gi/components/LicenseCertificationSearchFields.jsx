import React from 'react';
import Dropdown from './Dropdown';

function LicenseCertificationSearchFields() {
  const handleChange = e => {
    return e.target;
  };
  return (
    <>
      <div className="row">
        <va-text-input label="License/Certification Name" />
      </div>
      <div className="row">
        <Dropdown
          disabled={false}
          // required
          label="Category Type"
          visible
          name="Cateogry"
          options={[
            { optionValue: 'License', optionLabel: 'License' },
            { optionValue: 'Certification', optionLabel: 'Certification' },
          ]}
          value=""
          onChange={handleChange}
          alt="Category Type"
          selectClassName="lc-dropdown-filter"
        />
      </div>
      <div className="row">
        <Dropdown
          disabled={false}
          label="Country"
          visible
          name="Country"
          options={[{ optionValue: 'Country', optionLabel: 'Country' }]}
          value=""
          onChange={handleChange}
          alt="Country"
          selectClassName="lc-dropdown-filter"
        />
      </div>
      <div className="row">
        <Dropdown
          disabled={false}
          label="State"
          visible
          name="State"
          options={[{ optionValue: 'State', optionLabel: 'State' }]}
          value=""
          onChange={handleChange}
          alt="State"
          selectClassName="lc-dropdown-filter"
        />
      </div>
    </>
  );
}

export default LicenseCertificationSearchFields;
