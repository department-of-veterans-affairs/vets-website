import PropTypes from 'prop-types';
import React from 'react';

export default function SearchDescription({
  categoryFilter,
  pageEnd,
  pageStart,
  statusFilter,
  tabName,
  total,
  query,
}) {
  const displayCount = total ? `${pageStart}-${pageEnd} of ${total}` : 'no';
  const queryPart = query ? `for "${query}" ` : '';

  const tabInfo = tabName ? `" in "${tabName}` : '';

  return (
    <div id="search-description">
      <h3 className="vads-u-font-family--sans vads-u-font-size--md">
        Showing {displayCount} results {queryPart}
        with the status set to "{statusFilter}" and the category set to "
        {categoryFilter}
        {tabInfo}
        ."
      </h3>
      {!total && (
        <>
          <p data-testid="no-results-suggestion">
            Search 1 of these 3 things to get more results:
          </p>
          <ul>
            <li>Reference number</li>
            <li>Category name</li>
            <li>Original question</li>
          </ul>
        </>
      )}
    </div>
  );
}

SearchDescription.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  pageEnd: PropTypes.number,
  pageStart: PropTypes.number,
  tabName: PropTypes.oneOf(['Business', 'Personal']),
};
