import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const FilterBy = ({ filterByOptions, onChange, selectedOption }) => {
  return (
    <>
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2">
        <VaSelect
          data-testid="events-filter-by"
          label="Filter by"
          name="filterBy"
          onVaSelect={onChange}
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
        </VaSelect>
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
