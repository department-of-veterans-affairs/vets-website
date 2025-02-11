import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { chunk } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { clientServerErrorContent, useResizeObserver } from '../helpers';

const MAX_PAGES_CONTAINER_WIDTH = 640; // USWDS width-tablet setting
const MAX_ROWS = 6;

const paginateData = data => {
  return chunk(data, MAX_ROWS);
};

const getFromToNums = (page, total) => {
  const from = (page - 1) * MAX_ROWS + 1;
  const to = Math.min(page * MAX_ROWS, total);

  return [from, to];
};

const Payments = ({
  data,
  fields,
  tableVersion,
  textContent,
  alertMessage,
}) => {
  // Page navigation
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = new URLSearchParams(location.search).get('page') || 1;

  // State
  const [currentData, setCurrentData] = useState([]);
  const [maxPageLength, setMaxPageLength] = useState(10);
  const [from, to] = getFromToNums(currentPage, data.length);

  // Refs
  const tableHeadingRef = useRef(null);
  const totalPages = useRef(0);

  const onPageChange = page => {
    const newURL = `${location.pathname}?page=${page}`;
    if (tableHeadingRef) {
      tableHeadingRef.current.focus();
    }
    navigate(newURL);
  };

  const onPaginationResize = useCallback((target, element) => {
    if (element.contentRect.width < MAX_PAGES_CONTAINER_WIDTH) {
      setMaxPageLength(5);
    }

    if (element.contentRect.width >= MAX_PAGES_CONTAINER_WIDTH) {
      setMaxPageLength(10);
    }
  }, []);

  const tablePaginationRef = useResizeObserver(onPaginationResize);

  useEffect(
    () => {
      const paginatedData = paginateData(data);
      setCurrentData(paginatedData[currentPage - 1]);
      totalPages.current = paginatedData.length;
    },
    [currentPage, data],
  );

  if (currentData) {
    return (
      <>
        {textContent}
        {alertMessage}
        <h3
          className="vads-u-font-size--lg vads-u-font-family--serif"
          ref={tableHeadingRef}
          tabIndex={-1}
        >
          Displaying {from} - {to} of {data.length} payments
        </h3>

        <va-table scrollable>
          <va-table-row slot="headers">
            {fields.map(field => (
              <span key={field.value}>{field.label}</span>
            ))}
          </va-table-row>
          {currentData.map((row, index) => {
            return (
              <va-table-row key={`payments-${index}`}>
                {fields.map(field => (
                  <span key={`${field.value}-${index}`}>
                    {row[field.value]}
                  </span>
                ))}
              </va-table-row>
            );
          })}
        </va-table>
        <div ref={tablePaginationRef}>
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            page={currentPage}
            pages={totalPages.current}
            maxPageListLength={maxPageLength}
            showLastPage
          />
        </div>
      </>
    );
  }

  return (
    <va-alert status="info">{clientServerErrorContent(tableVersion)}</va-alert>
  );
};

Payments.propTypes = {
  tableVersion: PropTypes.oneOf(['received', 'returned']).isRequired,
  alertMessage: PropTypes.element,
  data: PropTypes.array,
  fields: PropTypes.array,
  textContent: PropTypes.element,
};

export default Payments;
