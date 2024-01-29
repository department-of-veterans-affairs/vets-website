import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RecordListItem from './RecordListItem';
import { setPagination } from '../../actions/pagination';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const MAX_PAGE_LIST_LENGTH = 5;
const RecordList = props => {
  const { records, type, perPage = 10, hidePagination } = props;
  const totalEntries = records?.length;
  const paginationPage = useSelector(state =>
    state.mr.pagination.page.find(key => key.domain === type),
  );

  const dispatch = useDispatch();
  const [currentRecords, setCurrentRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(paginationPage.value);
  const [isInitialPage, setInitialPage] = useState(true);
  const paginatedRecords = useRef([]);

  const onPageChange = page => {
    setInitialPage(false);
    setCurrentRecords(paginatedRecords.current[page - 1]);
    setCurrentPage(page);
    dispatch(setPagination(type, page));
  };

  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  useEffect(
    () => {
      if (records?.length) {
        paginatedRecords.current = chunk(records, perPage);
        setCurrentRecords(paginatedRecords.current[currentPage - 1]);
      }
    },
    [currentPage, records, perPage],
  );

  useEffect(
    () => {
      if (!isInitialPage) {
        focusElement(document.querySelector('#showingRecords'));
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    },
    [currentPage, isInitialPage],
  );

  const displayNums = fromToNums(currentPage, records?.length);

  return (
    <div className="record-list vads-l-row vads-u-flex-direction--column">
      <h2
        className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--0 vads-u-font-weight--normal vads-u-padding-y--1 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print"
        hidden={hidePagination}
        id="showingRecords"
        aria-label={`Showing ${displayNums[0]} to ${
          displayNums[1]
        } of ${totalEntries} records from newest to oldest`}
      >
        {`Showing ${displayNums[0]} to ${
          displayNums[1]
        } of ${totalEntries} records from newest to oldest`}
      </h2>
      <h2 className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0 vads-u-padding--0 vads-u-font-weight--normal vads-u-border-color--gray-light print-only">
        Showing {totalEntries} from newest to oldest
      </h2>
      <div className="no-print">
        {currentRecords?.length > 0 &&
          currentRecords.map((record, idx) => (
            <RecordListItem key={idx} record={record} type={type} />
          ))}
      </div>
      <div className="print-only">
        {records?.length > 0 &&
          records.map((record, idx) => (
            <RecordListItem key={idx} record={record} type={type} />
          ))}
      </div>
      {currentRecords &&
        (paginatedRecords.current.length > 1 ? (
          <div className="vads-u-margin-bottom--2 no-print">
            <VaPagination
              onPageSelect={e => onPageChange(e.detail.page)}
              page={currentPage}
              pages={paginatedRecords.current.length}
              maxPageListLength={MAX_PAGE_LIST_LENGTH}
              showLastPage
              uswds
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
