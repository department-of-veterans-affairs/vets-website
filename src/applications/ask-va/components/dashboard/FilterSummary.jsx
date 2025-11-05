import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export default function FilterSummary({
  categoryFilter,
  currentTab,
  pageStart,
  hasTabs,
  pageEnd,
  statusFilter,
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
        'vads-u-margin-top--2 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light',
        { 'vads-u-padding-x--0': !hasTabs },
        { 'vads-u-padding-x--2p5': hasTabs },
      )}
    >
      Showing {total ? resultsDescription : 'no'} results for "
      <strong>{statusFilter}</strong>" {statusDescription} and "
      <strong>{categoryFilter}</strong>" {categoryDescription}
      {hasTabs && (
        <>
          {' '}
          in <span className="vads-u-font-weight--bold">{currentTab}</span>
        </>
      )}
    </h3>
  );
}

FilterSummary.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  currentTab: PropTypes.oneOf(['business', 'personal']).isRequired,
  pageEnd: PropTypes.number.isRequired,
  pageStart: PropTypes.number.isRequired,
  statusFilter: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  hasTabs: PropTypes.bool,
};
