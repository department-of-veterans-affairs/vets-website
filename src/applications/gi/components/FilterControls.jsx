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
  const stopPropagation = e => {
    e.stopPropagation();
  };

  return (
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    <div
      className="vads-u-padding-bottom--4 vads-u-padding-top--2"
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
    >
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
      <fieldset
        className="vads-u-padding-bottom--2"
        role="group"
        aria-labelledby="category-type-heading"
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <legend
          className="vads-u-margin-bottom--1 vads-u-margin-top--0p5 filter-header"
          id="category-type-heading"
        >
          Category type
        </legend>
        {categoryCheckboxes.map((option, index) => {
          return (
            <VaCheckbox
              key={index}
              label={option.label}
              name={option.name}
              checked={option.checked}
              className="category-checkbox"
              onVaChange={e => {
                handleCheckboxGroupChange(e);
              }}
            />
          );
        })}
      </fieldset>

      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
      <fieldset
        role="group"
        aria-labelledby="state-heading"
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <legend
          className="vads-u-margin-bottom--1 filter-header"
          id="state-heading"
        >
          State
        </legend>
        <Dropdown
          label="Applies to only license and prep course category type. Certifications are available nationwide."
          name={dropdown.label}
          alt="Filter results by state"
          options={dropdown.options}
          value={filterLocation}
          onChange={e => {
            handleDropdownChange(e);
          }}
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
