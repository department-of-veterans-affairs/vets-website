import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import Dropdown from './Dropdown';

function FilterControls({
  categoryCheckboxes,
  handleCheckboxGroupChange,
  dropdown,
  handleDropdownChange,
  filterLocation,
}) {
  return (
    <div>
      <>
        <h3 className="vads-u-margin-bottom--3 vads-u-margin-top--0p5">
          Category type
        </h3>
        {categoryCheckboxes.map((option, index) => {
          return (
            <VaCheckbox
              key={index}
              label={option.label}
              name={option.name}
              checked={option.checked}
              className="category-checkbox"
              onVaChange={e => handleCheckboxGroupChange(e)}
            />
          );
        })}
      </>

      <>
        <h3 className="vads-u-margin-bottom--2">State</h3>
        <Dropdown
          label="Applies to only license and prep course category type. Certifications are available nationwide."
          name={dropdown.label}
          alt="Filter results by state"
          options={dropdown.options}
          value={filterLocation}
          onChange={handleDropdownChange}
          className="state-dropdown"
          visible
          boldLabel
        />
      </>
    </div>
  );
}

export default FilterControls;
