import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  useHistory,
  useLocation,
} from 'react-router-dom/cjs/react-router-dom.min';
import RecordListItem from './RecordListItem';
import { getParamValue, sendDataDogAction } from '../../util/helpers';

const RecordListNew = ({
  records,
  type,
  hidePagination,
  domainOptions,
  metadata: {
    pagination: { currentPage, perPage, totalPages, totalEntries },
  },
}) => {
  const history = useHistory();
  const location = useLocation();
  const paramPage = getParamValue(location.search, 'page') || currentPage;

  const onPageChange = page => {
    sendDataDogAction(`Pagination - ${type}`);
    history.push(`${history.location.pathname}?page=${page}`);
  };

  useEffect(
    /** Whenever the URL changes, scroll & focus back to the list */
    () => {
      const urlPage = paramPage;
      if (urlPage > 1) {
        focusElement(document.querySelector('#showingRecords'));
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    },
    [location.search, paramPage],
  );

  // Calculate “Showing X–Y of Z”
  const from = (currentPage - 1) * perPage + 1;
  // records.length might be < perPage on the last page
  const to = from + records.length - 1;

  return (
    <div className="record-list vads-l-row vads-u-flex-direction--column">
      <h2 className="sr-only" data-dd-privacy="mask">
        {`List of ${type}`}
      </h2>

      {/* Summary line */}
      <p
        id="showingRecords"
        className="vads-u-margin-bottom--3"
        hidden={hidePagination}
        data-dd-privacy="mask"
      >
        {`Showing ${from} to ${to} of ${totalEntries} records from newest to oldest`}
      </p>

      {/* The list itself */}
      <ul className="record-list-items no-print vads-u-margin--0 vads-u-padding--0">
        {records.map((record, idx) => (
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
        {records.map((record, idx) => (
          <li key={idx}>
            <RecordListItem record={record} type={type} />
          </li>
        ))}
      </ul>

      {/* Pagination footer */}
      {totalPages > 1 ? (
        <div className="vads-u-margin-bottom--2 no-print">
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            page={paramPage}
            pages={totalPages}
            showLastPage
            uswds
          />
        </div>
      ) : (
        <div className="vads-u-margin-bottom--5 no-print" />
      )}
    </div>
  );
};

RecordListNew.propTypes = {
  metadata: PropTypes.object.isRequired,
  records: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  domainOptions: PropTypes.object,
  hidePagination: PropTypes.bool,
};

export default RecordListNew;
