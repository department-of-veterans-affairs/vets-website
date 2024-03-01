import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory } from 'react-router-dom';
import MedicationsListCard from './MedicationsListCard';
import { rxListSortingOptions } from '../../util/constants';
import PrescriptionPrintOnly from '../PrescriptionDetails/PrescriptionPrintOnly';

const MAX_PAGE_LIST_LENGTH = 6;
const perPage = 20;
const MedicationsList = props => {
  const history = useHistory();
  const { rxList, pagination, selectedSortOption, updateLoadingStatus } = props;
  const prescriptionId = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails?.prescriptionId,
  );
  const scrollLocation = useRef();
  const goToPrevious = () => {
    scrollLocation.current?.scrollIntoView();
  };

  useEffect(
    () => {
      if (prescriptionId) {
        goToPrevious();
      }
    },
    [prescriptionId],
  );

  const displaynumberOfPrescriptionsSelector =
    ".no-print [data-testid='page-total-info']";

  const onPageChange = page => {
    document.querySelector('.va-breadcrumbs-li')?.scrollIntoView();
    updateLoadingStatus(true, 'Loading your list...');
    history.push(`/?page=${page}`);
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
        Showing
        <span className="no-print">
          {` ${displayNums[0]} - ${displayNums[1]} of`}
        </span>
        {` ${pagination.totalEntries} medications, ${rxListSortingOptions[
          selectedSortOption
        ]?.LABEL.toLowerCase()}`}
      </h2>
      <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter" />
      <div className="print-only vads-u-margin--0 vads-u-width--full">
        {rxList?.length > 0 &&
          rxList.map((rx, idx) => (
            <PrescriptionPrintOnly
              hideLineBreak={idx === rxList.length - 1}
              key={idx}
              rx={rx}
            />
          ))}
      </div>
      <div
        className="vads-u-display--block vads-u-margin-top--3"
        data-testid="medication-list"
      >
        {rxList?.length > 0 &&
          rxList.map(
            (rx, idx) =>
              rx.prescriptionId === prescriptionId ? (
                <div ref={scrollLocation} key={idx}>
                  <MedicationsListCard rx={rx} />
                </div>
              ) : (
                <MedicationsListCard key={idx} rx={rx} />
              ),
          )}
      </div>
      <VaPagination
        max-page-list-length={MAX_PAGE_LIST_LENGTH}
        id="pagination"
        className="pagination vads-u-justify-content--center no-print"
        onPageSelect={e => onPageChange(e.detail.page)}
        page={pagination.currentPage}
        pages={pagination.totalPages}
        uswds
      />
    </>
  );
};

export default MedicationsList;

MedicationsList.propTypes = {
  pagination: PropTypes.object,
  rxList: PropTypes.array,
  selectedSortOption: PropTypes.string,
  setCurrentPage: PropTypes.func,
  updateLoadingStatus: PropTypes.func,
};
