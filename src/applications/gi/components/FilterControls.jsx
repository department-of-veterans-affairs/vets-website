import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import PropTypes from 'prop-types';
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
      <fieldset role="group" aria-label="Category type">
        <legend className="vads-u-visibility--screen-reader">
          Category type
        </legend>
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
      </fieldset>

      <fieldset role="group" aria-label="State">
        <legend className="vads-u-visibility--screen-reader">State</legend>
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
      </fieldset>
    </div>
  );
}

FilterControls.propTypes = {
  categoryCheckboxes: PropTypes.arrayOf(
    PropTypes.shape({
      checked: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  dropdown: PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        optionValue: PropTypes.string.isRequired,
        optionLabel: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  filterLocation: PropTypes.string.isRequired,
  handleCheckboxGroupChange: PropTypes.func.isRequired,
  handleDropdownChange: PropTypes.func.isRequired,
};

export default FilterControls;
