import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
        <VaCheckboxGroup
          onVaChange={e => handleCheckboxGroupChange(e)}
          options={categoryCheckboxes}
          label="Category"
          label-header-level="3"
          class="vads-u-margin-top--0"
        >
          {categoryCheckboxes.map((option, index) => {
            return (
              <va-checkbox
                key={index}
                label={option.label}
                name={option.name}
                checked={option.checked}
              />
            );
          })}
        </VaCheckboxGroup>
      </>

      <>
        <h3 className="vads-u-margin-bottom--0">State</h3>
        <Dropdown
          label="Applies to only license and prep course category type. Certifications are available nationwide."
          name={dropdown.label}
          alt="Filter results by state"
          options={dropdown.options}
          value={filterLocation}
          onChange={handleDropdownChange}
          className="state-dropdown"
          visible
        />
      </>
    </div>
  );
}

export default FilterControls;
