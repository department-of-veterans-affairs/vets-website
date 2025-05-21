import React from 'react';
import PropTypes from 'prop-types';

const RecordListHeader = ({
  currentPage,
  recordsLength,
  totalEntries,
  domainOptions = {},
  hidePagination,
  perPage,
}) => {
  const { isAccelerating = false, displayTimeFrame } = domainOptions;
  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  const displayNums = fromToNums(currentPage, recordsLength);
  // This feels wrong and would love feedback on how to improve this.
  const filterDisplayMessage = isAccelerating
    ? displayTimeFrame
    : 'newest to oldest';
  return (
    <>
      <p
        className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--0 vads-u-font-weight--normal vads-u-padding-y--1 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print"
        hidden={hidePagination}
        id="showingRecords"
        data-testid="showingRecords"
        data-dd-privacy="mask"
        data-dd-action-name
      >
        <span>
          {`Showing ${displayNums[0]} to ${
            displayNums[1]
          } of ${totalEntries} records from `}
          <span
            className={isAccelerating ? 'vads-u-font-weight--bold' : ''}
            data-testid="filter-display-message"
          >
            {filterDisplayMessage}
          </span>
        </span>
      </p>
      <h2 className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0 vads-u-padding--0 vads-u-font-weight--normal vads-u-border-color--gray-light print-only">
        Showing {totalEntries} records from {filterDisplayMessage}
      </h2>
    </>
  );
};

export default RecordListHeader;

RecordListHeader.propTypes = {
  currentPage: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  recordsLength: PropTypes.number.isRequired,
  totalEntries: PropTypes.number.isRequired,
  domainOptions: PropTypes.shape({
    isAccelerating: PropTypes.bool,
    displayTimeFrame: PropTypes.string,
  }),
  hidePagination: PropTypes.bool,
};
