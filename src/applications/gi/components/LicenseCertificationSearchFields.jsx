import React from 'react';
import Dropdown from './Dropdown';

const dropdowns = [
  {
    label: 'Category',
    options: [
      { optionValue: 'License', optionLabel: 'License' },
      { optionValue: 'Certification', optionLabel: 'Certification' },
    ],
    alt: 'Category Type',
  },
  {
    label: 'Country',
    options: [{ optionValue: 'Country', optionLabel: 'Country' }],
    alt: 'Country',
  },
  {
    label: 'State',
    options: [{ optionValue: 'State', optionLabel: 'State' }],
    alt: 'State',
  },
];

function LicenseCertificationSearchFields() {
  const handleChange = e => {
    return e.target;
  };

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
              label={dropdown.label}
              visible
              name="Cateogry"
              options={dropdown.options}
              value=""
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
