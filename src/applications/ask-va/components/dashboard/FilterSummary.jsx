import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

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
  const queryPart = query ? `"${query}" for ` : '';

  // Singular or plural
  const statusAmount = `status${statusFilter !== 'All' ? '' : 'es'}`;
  const categoryAmount = `categor${categoryFilter !== 'All' ? 'y' : 'ies'}`;

  const tabInfo = tabName ? ` in "${tabName}"` : '';

  return (
    <h3
      id="filter-summary"
      className={classNames(
        'vads-u-margin-top--2 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-font-weight--normal vads-u-font-size--md',
        { 'vads-u-padding-x--0': !tabName },
        { 'vads-u-padding-x--2p5': !!tabName },
      )}
    >
      Showing {displayCount} results for {queryPart}"{statusFilter}"{' '}
      {statusAmount} and "{categoryFilter}" {categoryAmount}
      {tabInfo}
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
