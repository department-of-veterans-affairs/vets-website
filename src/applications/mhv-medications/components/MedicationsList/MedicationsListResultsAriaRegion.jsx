import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import {
  filterOptions,
  ALL_MEDICATIONS_FILTER_KEY,
  rxListSortingOptions,
} from '../../util/constants';

/**
 * An aria live region that announces changes to filter and sort options
 * as well as the current list "Showing X - Y of Z <filter>, <sort>" text.
 *
 * filterOption - the filter option key. Should be a key of {@link filterOptions}
 * sortOption - the sort option key. Should be a key of {@link rxListSortingOptions}
 * resultsText - the "Showing X - Y of Z <filter>, <sort>" text
 */
const MedicationsListResultsAriaRegion = ({
  filterOption,
  resultsText,
  sortOption,
}) => {
  const previousFilter = useRef(filterOption);
  const previousSort = useRef(sortOption);
  const previousDisplayText = useRef(resultsText);
  const wasFilterCleared = useRef(false);
  const [ariaRegionText, setAriaRegionText] = useState('');

  useEffect(
    () => {
      if (filterOption && filterOption !== previousFilter.current) {
        if (filterOption !== ALL_MEDICATIONS_FILTER_KEY) {
          const updatedAriaText = `Filter applied: ${
            filterOptions[filterOption]?.label
          }.`;

          setAriaRegionText(updatedAriaText);
        } else {
          // Clearing the filters is instant, so the results text will overwrite on the next render, causing a message set here to render unreliably.
          // Instead, set this flag to true and it in the results text update.
          wasFilterCleared.current = true;
        }

        previousFilter.current = filterOption;
      } else if (sortOption && sortOption !== previousSort.current) {
        const updatedAriaText = `Sorting: ${
          rxListSortingOptions[sortOption]?.LABEL
        }.`;

        setAriaRegionText(updatedAriaText);
        previousSort.current = sortOption;
      } else if (resultsText && resultsText !== previousDisplayText.current) {
        const updatedAriaText = `${
          wasFilterCleared.current ? 'Filters cleared. ' : ''
        }${resultsText}`;

        // Once the cleared filters are announced, reset the flag until they're cleared again
        wasFilterCleared.current = false;
        setAriaRegionText(updatedAriaText);
        previousDisplayText.current = resultsText;
      }
    },
    [filterOption, sortOption, resultsText],
  );

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      data-testid="filter-aria-live-region"
      className="sr-only"
    >
      {ariaRegionText}
    </div>
  );
};

MedicationsListResultsAriaRegion.propTypes = {
  filterOption: PropTypes.string,
  resultsText: PropTypes.string,
  sortOption: PropTypes.string,
};

export default MedicationsListResultsAriaRegion;
