import React from 'react';
import PropTypes from 'prop-types';

const FilterBy = ({ filterByOptions, onChange, selectedOption }) => {
  return (
    <>
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
        <fieldset>
          <legend
            className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-weight--normal vads-u-line-height--2"
            data-testid="events-filter-by-label"
            id="filterByLabel"
            htmlFor="filterBy"
            style={{ flexShrink: 0 }}
          >
            Filter by
          </legend>
          <select
            className="filter-by"
            data-testid="events-filter-by"
            id="filterBy"
            name="filterBy"
            aria-labelledby="filterByLabel"
            onChange={onChange}
            value={selectedOption?.value}
          >
            {filterByOptions?.map(option => (
              <option
                key={option?.value}
                data-testid={option?.label}
                value={option?.value}
              >
                {option?.label}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
    </>
  );
};

FilterBy.propTypes = {
  filterByOptions: PropTypes.array.isRequired,
  selectedOption: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterBy;
