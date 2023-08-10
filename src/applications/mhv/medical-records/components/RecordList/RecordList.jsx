import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RecordListItem from './RecordListItem';
import { RecordType } from '../../util/constants';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const MAX_PAGE_LIST_LENGTH = 5;
const RecordList = props => {
  const { records, type, perPage = 10, hidePagination } = props;
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
      <div
        className="pagination vads-u-padding-y--1 vads-u-margin-bottom--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print"
        hidden={hidePagination}
      >
        Showing {displayNums[0]}
        &#8211;
        {displayNums[1]} of {totalEntries} records
      </div>
      <div className="no-print">
        {currentRecords?.length > 0 &&
          currentRecords.map((record, idx) => (
            <RecordListItem key={idx} record={record} type={type} />
          ))}
      </div>
      {type !== RecordType.VITALS &&
        type !== RecordType.CARE_SUMMARIES_AND_NOTES &&
        type !== RecordType.LABS_AND_TESTS && (
          <div className="print-only">
            {records?.length > 0 &&
              records.map((record, idx) => (
                <RecordListItem key={idx} record={record} type={type} />
              ))}
          </div>
        )}
      {currentRecords &&
        (paginatedRecords.current.length > 1 ? (
          <div className="pagination vads-u-margin-bottom--2 no-print">
            <VaPagination
              onPageSelect={e => onPageChange(e.detail.page)}
              page={currentPage}
              pages={paginatedRecords.current.length}
              maxPageListLength={MAX_PAGE_LIST_LENGTH}
              showLastPage
            />
          </div>
        ) : (
          <div className="vads-u-margin-bottom--5 no-print" />
        ))}
    </div>
  );
};

export default RecordList;

RecordList.propTypes = {
  hidePagination: PropTypes.bool,
  perPage: PropTypes.number,
  records: PropTypes.array,
  type: PropTypes.string,
};
