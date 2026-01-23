import PropTypes from 'prop-types';
import React from 'react';

export default function FilterSummary({
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
    <h3
      id="filter-summary"
      className="vads-u-font-family--sans vads-u-font-size--md"
    >
      Showing {displayCount} results {queryPart}
      with the status set to "{statusFilter}" and the category set to "
      {categoryFilter}
      {tabInfo}
      ."
    </h3>
  );
}

FilterSummary.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  pageEnd: PropTypes.number,
  pageStart: PropTypes.number,
  tabName: PropTypes.oneOf(['Business', 'Personal']),
};
