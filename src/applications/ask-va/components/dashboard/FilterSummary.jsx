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
}) {
  const resultsDescription = `${pageStart}-${pageEnd} of ${total}`;
  const statusDescription = statusFilter === 'All' ? 'statuses' : 'status';
  const categoryDescription =
    categoryFilter === 'All' ? 'categories' : 'category';

  return (
    <h3
      id="filter-summary"
      className={classNames(
        'vads-u-margin-top--2 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-font-weight--normal vads-u-font-size--md',
        { 'vads-u-padding-x--0': !tabName },
        { 'vads-u-padding-x--2p5': !!tabName },
      )}
    >
      Showing {total ? resultsDescription : 'no'} results for "
      <strong>{statusFilter}</strong>" {statusDescription} and "
      <strong>{categoryFilter}</strong>" {categoryDescription}
      {!!tabName && (
        <>
          {' '}
          in <strong>{tabName}</strong>
        </>
      )}
    </h3>
  );
}

FilterSummary.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  pageEnd: PropTypes.number.isRequired,
  pageStart: PropTypes.number.isRequired,
  statusFilter: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  tabName: PropTypes.oneOf(['Business', 'Personal']),
};
