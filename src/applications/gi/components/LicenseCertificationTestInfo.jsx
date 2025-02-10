import React, { useLayoutEffect, useState } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  formatDollarAmountWithCents,
  formatResultCount,
  isSmallScreen,
} from '../utils/helpers';

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
    <div
      className={
        isSmallScreen()
          ? 'vads-u-padding-bottom--5'
          : 'vads-u-padding-bottom--9'
      }
    >
      <h3>Test info</h3>
      <p className="vads-u-color--gray-dark vads-u-margin--0 vads-u-padding-y--1">
        Showing{' '}
        <>
          {`${formatResultCount(tests, currentPage, itemsPerPage)} of ${
            tests.length
          } tests`}
        </>
      </p>
      {tests.length > 1 ? (
        <>
          <div className="table-wrapper">
            <va-table
              table-type={isSmallScreen() ? 'bordered' : 'borderless'}
              stacked
            >
              <va-table-row slot="headers">
                <span>Test Name</span>
                <span>Fees</span>
              </va-table-row>
              {currentResults &&
                currentResults.map((test, index) => {
                  return (
                    <va-table-row key={index}>
                      <span>{test.name}</span>
                      <span>
                        {formatDollarAmountWithCents(
                          test.fee,
                          'test fee not available',
                        )}
                      </span>
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
      ) : (
        <div className="single-test-wrapper">
          <h4>Test name: {tests[0].name}</h4>
          {/* <p className="fee">Fee {formatCurrency(tests[0].fee)}</p> */}
          <p className="fee">
            Fee:{' '}
            {formatDollarAmountWithCents(
              tests[0].fee,
              'test fee not available',
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default LcTestInfo;
