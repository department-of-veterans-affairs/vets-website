import React, { useEffect, useState, useRef } from 'react';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { clientServerErrorContent } from '../helpers';

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
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = new URLSearchParams(location.search).get('page') || 1;

  // State
  const [currentData, setCurrentData] = useState([]);
  const [maxPageLength, setMaxPageLength] = useState(10);

  // Refs
  const totalPages = useRef(0);
  const tableHeadingRef = useRef(null);
  const tablePaginationRef = useRef(null);

  useEffect(
    () => {
      const paginatedData = paginateData(data);
      setCurrentData(paginatedData[currentPage - 1]);
      totalPages.current = paginatedData.length;
    },
    [currentPage, data],
  );

  /* eslint-disable-next-line consistent-return */
  useEffect(() => {
    /**
     * Using ResizeObserver to update number of table pagination links
     * based on viewport width or zoom rate. USWDS tablet breakpoint
     * is the magic number default for updating state.
     *
     * See https://designsystem.digital.gov/utilities/height-and-width/
     */
    if (window.ResizeObserver && tablePaginationRef.current) {
      const handleResizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.contentRect.width < MAX_PAGES_CONTAINER_WIDTH) {
            setMaxPageLength(5);
          }

          if (entry.contentRect.width >= MAX_PAGES_CONTAINER_WIDTH) {
            setMaxPageLength(10);
          }
        }
      });

      handleResizeObserver.observe(tablePaginationRef.current);

      return () => {
        handleResizeObserver.disconnect();
      };
    }
  }, []);

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
            pages={15}
            // pages={totalPages.current}
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
