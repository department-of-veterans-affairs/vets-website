import React, { useEffect, useState, useRef } from 'react';
import Table from '@department-of-veterans-affairs/component-library/Table';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { clientServerErrorContent } from '../helpers';

const MAX_PAGE_LIST_LENGTH = 10;
const MAX_ROWS = 6;

const getAriaLabelledBy = tableVersion =>
  tableVersion === 'received'
    ? 'paymentsReceivedHeader paymentsReceivedContent'
    : 'paymentsReturnedHeader paymentsReturnedContent';

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
  const numPages = useRef(0);
  const paginatedData = useRef([]);

  useEffect(() => {
    paginatedData.current = paginateData(data);

    setCurrentData(paginatedData.current[currentPage - 1]);
    numPages.current = paginatedData.current.length;
  }, []);

  const onPageChange = page => {
    setCurrentData(paginatedData.current[page - 1]);
    setCurrentPage(page);
  };

  const tableAriaLabelledBy = getAriaLabelledBy(tableVersion);
  const fromToNums = getFromToNums(currentPage, data.length);

  if (currentData) {
    return (
      <>
        {textContent}
        <p className="vads-u-font-size--lg vads-u-font-family--serif">
          Displaying {fromToNums[0]} - {fromToNums[1]} of {data.length}
        </p>
        <Table
          ariaLabelledBy={tableAriaLabelledBy}
          className="va-table"
          fields={fields}
          data={currentData}
          maxRows={MAX_ROWS}
        />
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={currentPage}
          pages={numPages.current}
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
  data: PropTypes.array,
  fields: PropTypes.array,
  textContent: PropTypes.element,
};

export default Payments;
