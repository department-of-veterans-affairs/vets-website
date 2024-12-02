import React, { useEffect, useState, useRef } from 'react';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { clientServerErrorContent } from '../helpers';

const MAX_PAGE_LIST_LENGTH = 10;
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
  const location = useLocation();
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState([]);
  const currentPage = new URLSearchParams(location.search).get('page') || 1;
  const [totalPages, setTotalPages] = useState(0);
  const tableHeadingRef = useRef(null);

  useEffect(
    () => {
      const paginatedData = paginateData(data);
      setCurrentData(paginatedData[currentPage - 1]);
      setTotalPages(paginatedData.length);
    },
    [currentPage, data],
  );

  const onPageChange = page => {
    const newURL = `${location.pathname}?page=${page}`;
    if (tableHeadingRef) {
      tableHeadingRef.current.focus();
    }
    navigate(newURL);
  };

  const [from, to] = getFromToNums(currentPage, data.length);

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
        <va-table>
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
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={currentPage}
          pages={totalPages}
          maxPageListLength={MAX_PAGE_LIST_LENGTH}
          showLastPage
        />
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
