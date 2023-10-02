import React from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import MedicationsListCard from './MedicationsListCard';

const perPage = 20;
const MedicationsList = props => {
  const { rxList, pagination, setCurrentPage } = props;
  const displaynumberOfPrescriptionsSelector =
    "[data-testid='page-total-info']";

  const onPageChange = page => {
    setCurrentPage(page);
    waitForRenderThenFocus(displaynumberOfPrescriptionsSelector, document, 500);
  };

  const fromToNumbs = (page, total) => {
    if (rxList?.length < 1) {
      return [0, 0];
    }
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    return [from, to];
  };

  const displayNums = fromToNumbs(
    pagination.currentPage,
    pagination.totalEntries,
  );

  return (
    <>
      <h2
        className="rx-page-total-info vads-u-font-family--sans"
        data-testid="page-total-info"
        id="showingRx"
      >
        Showing {displayNums[0]} - {displayNums[1]} of {rxList.length}{' '}
        medications, available to fill or refill first
      </h2>
      <div className="rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter" />
      <div className="vads-u-display--block vads-u-margin-top--3">
        {rxList?.length > 0 &&
          rxList.map((rx, idx) => <MedicationsListCard key={idx} rx={rx} />)}
      </div>
      <VaPagination
        id="pagination"
        className="pagination"
        onPageSelect={e => onPageChange(e.detail.page)}
        page={pagination.currentPage}
        pages={pagination.totalPages}
        maxPageListLength={pagination.perPage}
        uswds
      />
    </>
  );
};

export default MedicationsList;

MedicationsList.propTypes = {
  pagination: PropTypes.object,
  rxList: PropTypes.array,
  setCurrentPage: PropTypes.func,
};
