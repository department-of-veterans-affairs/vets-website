import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RecordListItem from './RecordListItem';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const MAX_PAGE_LIST_LENGTH = 5;
const RecordList = props => {
  const { records, type } = props;
  const perPage = 5;
  const totalEntries = records?.length;

  const [currentRecords, setCurrentRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedRecords = useRef([]);

  const paginateData = data => {
    return chunk(data, perPage);
  };

  const onPageChange = page => {
    setCurrentRecords(paginatedRecords.current[page - 1]);
    setCurrentPage(page);
  };

  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  useEffect(
    () => {
      if (records?.length) {
        paginatedRecords.current = paginateData(records);
        setCurrentRecords(paginatedRecords.current[currentPage - 1]);
      }
    },
    [currentPage, records],
  );

  const displayNums = fromToNums(currentPage, records?.length);

  return (
    <div className="record-list vads-l-row vads-u-flex-direction--column">
      <div className="vads-u-padding-y--2 vads-u-margin-y--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        Displaying {displayNums[0]}
        &#8211;
        {displayNums[1]} of {totalEntries} {type} records
      </div>
      {currentRecords?.length > 0 &&
        currentRecords.map((record, idx) => (
          <RecordListItem key={idx} record={record} />
        ))}
      {currentPage === paginatedRecords.current.length && (
        <p className="vads-u-margin-y--3 vads-u-color--gray-medium">
          End of records
        </p>
      )}
      {currentRecords &&
        paginatedRecords.current.length > 1 && (
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            page={currentPage}
            pages={paginatedRecords.current.length}
            maxPageListLength={MAX_PAGE_LIST_LENGTH}
            showLastPage
          />
        )}
    </div>
  );
};

export default RecordList;

RecordList.propTypes = {
  records: PropTypes.array,
  type: PropTypes.string,
};
