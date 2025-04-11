import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  useHistory,
  useLocation,
} from 'react-router-dom/cjs/react-router-dom.min';
import RecordListItem from './RecordListItem';
import { getParamValue, sendDataDogAction } from '../../util/helpers';
// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const RecordList = props => {
  const {
    records,
    type,
    perPage = 10,
    hidePagination,
    domainOptions,
    sortedBy = '',
  } = props;
  const totalEntries = records?.length;

  const history = useHistory();
  const location = useLocation();
  const paramPage = getParamValue(location.search, 'page');
  const [currentRecords, setCurrentRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(paramPage);
  const paginatedRecords = useRef([]);

  const allowFilterSort = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsFilterAndSort],
  );

  const onPageChange = page => {
    sendDataDogAction(`Pagination - ${type}`);
    const newURL = `${history.location.pathname}?page=${page}`;
    history.push(newURL);
    setCurrentRecords(paginatedRecords.current[page - 1]);
    setCurrentPage(page);
  };

  // tracks url param
  useEffect(() => {
    const historyParamVal = getParamValue(history.location.search, 'page');
    setCurrentRecords(paginatedRecords.current[historyParamVal - 1]);
    setCurrentPage(historyParamVal);
  }, [history.location.search]);

  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  useEffect(() => {
    if (records?.length) {
      paginatedRecords.current = chunk(records, perPage);
      setCurrentRecords(paginatedRecords.current[currentPage - 1]);
    }
  }, [records, perPage, currentPage]);

  useEffect(() => {
    if (currentPage > 1 && records?.length) {
      focusElement(document.querySelector('#showingRecords'));
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [currentPage, records]);

  const displayNums = fromToNums(currentPage, records?.length);

  return (
    <div className="record-list vads-l-row vads-u-flex-direction--column">
      <h2 className="sr-only" data-dd-privacy="mask" data-dd-action-name>
        {`List of ${type}`}
      </h2>
      <p
        className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--0 vads-u-font-weight--normal vads-u-padding-y--1 vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light no-print"
        hidden={hidePagination}
        id="showingRecords"
        data-dd-privacy="mask"
        data-dd-action-name
      >
        <span>
          {`Showing ${displayNums[0]} to ${
            displayNums[1]
          } of ${totalEntries} records${
            allowFilterSort ? `, ${sortedBy}` : ' from newest to oldest'
          }`}
        </span>
      </p>
      <h2 className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0 vads-u-padding--0 vads-u-font-weight--normal vads-u-border-color--gray-light print-only">
        {`Showing ${totalEntries} records${
          allowFilterSort ? `, ${sortedBy}` : ' from newest to oldest'
        }`}
      </h2>
      <div className="no-print">
        {currentRecords?.length > 0 &&
          currentRecords.map((record, idx) => (
            <RecordListItem
              key={idx}
              record={record}
              type={type}
              domainOptions={domainOptions}
            />
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
              showLastPage
              uswds
            />
          </div>
        ) : (
          !allowFilterSort && (
            <div className="vads-u-margin-bottom--5 no-print" />
          )
        ))}
    </div>
  );
};

export default RecordList;

RecordList.propTypes = {
  domainOptions: PropTypes.object,
  hidePagination: PropTypes.bool,
  perPage: PropTypes.number,
  records: PropTypes.array,
  sortedBy: PropTypes.string,
  type: PropTypes.string,
};
