import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory } from 'react-router-dom';
import { datadogRum } from '@datadog/browser-rum';
import MedicationsListCard from './MedicationsListCard';
import {
  ALL_MEDICATIONS_FILTER_KEY,
  SESSION_SELECTED_FILTER_OPTION,
  filterOptions,
  rxListSortingOptions,
} from '../../util/constants';
import PrescriptionPrintOnly from '../PrescriptionDetails/PrescriptionPrintOnly';
import { fromToNumbs } from '../../util/helpers';
import { selectFilterFlag, selectGroupingFlag } from '../../util/selectors';
import { dataDogActionNames } from '../../util/dataDogConstants';

const MAX_PAGE_LIST_LENGTH = 6;
const MedicationsList = props => {
  const history = useHistory();
  const {
    isFullList,
    rxList,
    pagination,
    selectedSortOption,
    updateLoadingStatus,
    scrollLocation,
  } = props;
  const sortOptionLowercase = rxListSortingOptions[
    selectedSortOption
  ]?.LABEL.toLowerCase();
  const totalMedications = pagination.totalEntries;
  const prescriptionId = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails?.prescriptionId,
  );
  const showFilterContent = useSelector(selectFilterFlag);
  const showGroupingFlag = useSelector(selectGroupingFlag);

  const perPage = showGroupingFlag ? 10 : 20;

  const displaynumberOfPrescriptionsSelector =
    ".no-print [data-testid='page-total-info']";

  const onPageChange = page => {
    datadogRum.addAction(dataDogActionNames.medicationsListPage.PAGINATION);
    document.getElementById('showingRx').scrollIntoView();
    // replace terniary with true once loading spinner is added for the filter list fetch
    updateLoadingStatus(!showFilterContent, 'Loading your medications...');
    history.push(`/?page=${page}`);
    waitForRenderThenFocus(displaynumberOfPrescriptionsSelector, document, 500);
  };

  const displayNums = fromToNumbs(
    pagination.currentPage,
    pagination.totalEntries,
    rxList?.length,
    perPage,
  );

  const selectedFilterOption =
    filterOptions[
      sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) ||
        ALL_MEDICATIONS_FILTER_KEY
    ]?.showingContentDisplayName;

  const filterAndSortContent = () => {
    return (
      <>
        {/* TODO: clean after the filter toggle is gone */}
        {showFilterContent &&
          !isFullList &&
          selectedFilterOption?.length > 0 && (
            <strong>{selectedFilterOption} medications</strong>
          )}
        {/* TODO: clean after the filter toggle is gone */}
        {`${
          showFilterContent && !isFullList && selectedFilterOption?.length > 0
            ? ''
            : ' medications'
        }, ${sortOptionLowercase}`}
      </>
    );
  };

  return (
    <>
      {/* clean after filter flag is removed */}
      {!showFilterContent && (
        <h2 className="sr-only no-print">List of Medications</h2>
      )}
      <p
        className="rx-page-total-info vads-u-font-family--sans"
        data-testid="page-total-info"
        id="showingRx"
      >
        <span className="no-print">
          {`Showing ${displayNums[0]} - ${
            displayNums[1]
          } of ${totalMedications}`}
          {filterAndSortContent()}
        </span>
        <span className="print-only">
          {`Showing ${totalMedications}`}
          {filterAndSortContent()}
        </span>
      </p>
      <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter" />
      <div className="print-only vads-u-margin--0 vads-u-width--full">
        {rxList?.length > 0 &&
          rxList.map((rx, idx) => <PrescriptionPrintOnly key={idx} rx={rx} />)}
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
  isFullList: PropTypes.bool,
  pagination: PropTypes.object,
  rxList: PropTypes.array,
  scrollLocation: PropTypes.object,
  selectedSortOption: PropTypes.string,
  setCurrentPage: PropTypes.func,
  updateLoadingStatus: PropTypes.func,
};
