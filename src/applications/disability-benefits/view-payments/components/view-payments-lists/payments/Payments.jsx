import React, { useEffect, useState, useRef } from 'react';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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

const Payments = ({ data, fields, tableVersion, textContent }) => {
  const [currentData, setCurrentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Using `useRef` here to avoid triggering a rerender whenever these are
  // updated
  const totalPages = useRef(0);
  const paginatedData = useRef([]);
  useEffect(() => {
    paginatedData.current = paginateData(data);
    setCurrentData(paginatedData.current[currentPage - 1]);
    totalPages.current = paginatedData.current.length;
  }, []);

  const onPageChange = page => {
    setCurrentData(paginatedData.current[page - 1]);
    setCurrentPage(page);
  };

  const fromToNums = getFromToNums(currentPage, data.length);

  if (currentData) {
    return (
      <>
        {textContent}
        <p className="vads-u-font-size--lg vads-u-font-family--serif">
          Displaying {fromToNums[0]} - {fromToNums[1]} of {data.length}
        </p>
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
          pages={totalPages.current}
          maxPageListLength={MAX_PAGE_LIST_LENGTH}
          showLastPage
          uswds
        />
      </>
    );
  }

  return (
    <va-alert status="info" uswds>
      {clientServerErrorContent(tableVersion)}
    </va-alert>
  );
};

Payments.propTypes = {
  tableVersion: PropTypes.oneOf(['received', 'returned']).isRequired,
  data: PropTypes.array,
  fields: PropTypes.array,
  textContent: PropTypes.element,
};

export default Payments;
