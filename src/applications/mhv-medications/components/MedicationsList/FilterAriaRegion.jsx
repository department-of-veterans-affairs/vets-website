import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import {
  filterOptions,
  ALL_MEDICATIONS_FILTER_KEY,
} from '../../util/constants';

const FilterAriaRegion = ({ filterOption }) => {
  const previousFilter = useRef(filterOption);
  const [filterText, setFilterText] = useState('');

  useEffect(
    () => {
      if (filterOption && filterOption !== previousFilter.current) {
        const updatedAriaText =
          filterOption === ALL_MEDICATIONS_FILTER_KEY
            ? 'Filters cleared. Showing all medications.'
            : `Filter applied: ${filterOptions[filterOption]?.label}.`;
        setFilterText(updatedAriaText);
        previousFilter.current = filterOption;
      }
    },
    [filterOption],
  );

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      data-testid="filter-aria-live-region"
      className="sr-only"
    >
      {filterText}
    </div>
  );
};

FilterAriaRegion.propTypes = {
  filterOption: PropTypes.string,
};

export default FilterAriaRegion;
