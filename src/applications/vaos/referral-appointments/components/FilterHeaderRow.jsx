import React from 'react';
import PropTypes from 'prop-types';

const FilterHeaderRow = ({ goToFilterPage, resultsCount }) => {
  return (
    <div className="vads-l-grid-container vads-u-padding--0 vads-u-margin-top--2">
      <div className="vads-l-row">
        <div className="vads-l-col vads-u-font-weight--bold">
          <va-icon icon="filter_list" size={4} srtext="Filter icon" />{' '}
          <va-link
            aria-label="Filter"
            text="Filter"
            data-testid="filter-link"
            onClick={goToFilterPage}
            tabindex="0"
          />
        </div>
        <div className="vads-l-col vads-u-text-align--right">
          {resultsCount} results
        </div>
      </div>
    </div>
  );
};

FilterHeaderRow.propTypes = {
  resultsCount: PropTypes.number.isRequired,
  goToFilterPage: PropTypes.func.isRequired,
};

export default FilterHeaderRow;
