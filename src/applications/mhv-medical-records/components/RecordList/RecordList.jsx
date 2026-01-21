import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  useHistory,
  useLocation,
} from 'react-router-dom/cjs/react-router-dom.min';
import RecordListItem from './RecordListItem';
import RecordListHeader from './RecordListHeader';
import { getParamValue, sendDataDogAction } from '../../util/helpers';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const RecordList = props => {
  const { records, type, perPage = 10, hidePagination, domainOptions } = props;
  const totalEntries = records?.length;

  const history = useHistory();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const hasPageParam = urlParams.has('page');

  const paramPage = getParamValue(location.search, 'page');
  const [currentRecords, setCurrentRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(paramPage) || 1);
  const paginatedRecords = useRef([]);

  const shouldFocusShowing = useRef(false);

  const onPageChange = page => {
    sendDataDogAction(`Pagination - ${type}`);

    // When user clicks to a new page, focus to "Showing"
    shouldFocusShowing.current = true;

    history.push(`${history.location.pathname}?page=${page}`);
    setCurrentRecords(paginatedRecords.current[page - 1]);
    setCurrentPage(Number(page));
  };

  useEffect(() => {
    // On deep link to a specific page, focus to "Showing"
    if (hasPageParam) shouldFocusShowing.current = true;
    // We only want to set this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tracks url param
  useEffect(
    () => {
      const historyParamVal = getParamValue(history.location.search, 'page');

      const pageNum = Number(historyParamVal) || 1;
      // Only update if it actually changed to avoid churn on the first click
      if (pageNum !== currentPage) {
        setCurrentRecords(paginatedRecords.current[pageNum - 1]);
        setCurrentPage(pageNum);
      } else {
        // keep currentRecords in sync even if pageNum is same
        setCurrentRecords(paginatedRecords.current[pageNum - 1]);
      }
    },
    [currentPage, history.location.search],
  );

  useEffect(
    () => {
      if (records?.length) {
        paginatedRecords.current = chunk(records, perPage);
        setCurrentRecords(paginatedRecords.current[currentPage - 1]);
      }
    },
    [records, perPage, currentPage],
  );

  useEffect(
    () => {
      if (shouldFocusShowing.current && records?.length) {
        focusElement(document.querySelector('#showingRecords'));
        // calculate height of "showing records" and scrolls to it.
        const showRecordsHeight = document
          .querySelector('#showingRecords')
          .getBoundingClientRect();
        window.scrollTo({
          top: showRecordsHeight.top + window.scrollY,
          left: 0,
        });
      }
    },
    [currentPage, paramPage, records],
  );

  return (
    <div className="record-list vads-l-row vads-u-flex-direction--column">
      <h2 className="sr-only" data-dd-privacy="mask" data-dd-action-name>
        {`List of ${type}`}
      </h2>
      <RecordListHeader
        currentPage={currentPage}
        recordsLength={records?.length}
        totalEntries={totalEntries}
        domainOptions={domainOptions}
        hidePagination={hidePagination}
        perPage={perPage}
      />
      <ul className="record-list-items no-print vads-u-margin--0 vads-u-padding--0">
        {currentRecords?.length > 0 &&
          currentRecords.map((record, idx) => (
            <li key={idx}>
              <RecordListItem
                record={record}
                type={type}
                domainOptions={domainOptions}
              />
            </li>
          ))}
      </ul>
      <ul className="record-list-items print-only vads-u-margin--0 vads-u-padding--0">
        {records?.length > 0 &&
          records.map((record, idx) => (
            <li key={idx}>
              <RecordListItem record={record} type={type} />
            </li>
          ))}
      </ul>
      {currentRecords &&
        (paginatedRecords.current.length > 1 ? (
          <div className="vads-u-margin-bottom--2 no-print">
            <VaPagination
              onPageSelect={e => onPageChange(e.detail.page)}
              page={currentPage}
              pages={paginatedRecords.current.length}
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
  domainOptions: PropTypes.shape({
    isAccelerating: PropTypes.bool,
    displayTimeFrame: PropTypes.string,
    timeFrame: PropTypes.string,
  }),
  hidePagination: PropTypes.bool,
  perPage: PropTypes.number,
  records: PropTypes.array,
  type: PropTypes.string,
};
