import React, { useLayoutEffect, useState } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatCurrency } from '../utils/helpers';

function LcTestInfo({ tests }) {
  const [currentPage, setCurrentPage] = useState(1);

  useLayoutEffect(
    // eslint-disable-next-line consistent-return
    () => {
      const observer = new MutationObserver(() => {
        const vaTableInner = document.querySelector(
          '.table-wrapper va-table-inner',
        );
        if (vaTableInner?.shadowRoot) {
          const { shadowRoot } = vaTableInner;
          const usaTable = shadowRoot.querySelector('.usa-table');
          if (usaTable) {
            usaTable.style.width = '100%';
          }
        }
      });
      const vaTable = document.querySelector('.table-wrapper va-table');
      if (vaTable) {
        observer.observe(vaTable, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
      return () => observer.disconnect();
    },
    [tests],
  );

  const itemsPerPage = 10;

  const totalPages = Math.ceil(tests.length / itemsPerPage);
  const currentResults =
    tests.length > itemsPerPage
      ? tests.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage,
        )
      : tests;

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  return (
    <>
      <h3>Test info</h3>
      <div className="table-wrapper">
        <va-table table-type="borderless" stacked>
          <va-table-row slot="headers">
            <span>Test Name</span>
            <span>Fees</span>
          </va-table-row>
          {currentResults &&
            currentResults.map((test, index) => {
              return (
                <va-table-row key={index}>
                  <span>{test.name}</span>
                  <span>{formatCurrency(test.fee)}</span>
                </va-table-row>
              );
            })}
        </va-table>
        {tests.length > itemsPerPage && (
          <VaPagination
            onPageSelect={e => handlePageChange(e.detail.page)}
            page={currentPage}
            pages={totalPages}
            maxPageListLength={itemsPerPage}
          />
        )}
      </div>
    </>
  );
}

export default LcTestInfo;
