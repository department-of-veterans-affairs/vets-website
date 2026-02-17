import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useNavigate } from 'react-router-dom-v5-compat';
import { datadogRum } from '@datadog/browser-rum';
import MedicationsListCard from './MedicationsListCard';
import {
  ALL_MEDICATIONS_FILTER_KEY,
  rxListSortingOptions,
} from '../../util/constants';
import { getFilterOptions } from '../../util/helpers/getRxStatus';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../../util/selectors';
import PrescriptionPrintOnly from '../PrescriptionDetails/PrescriptionPrintOnly';
import { fromToNumbs } from '../../util/helpers';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { selectPrescriptionId } from '../../selectors/selectPrescription';
import { selectFilterOption } from '../../selectors/selectPreferences';

const MAX_PAGE_LIST_LENGTH = 6;
const MedicationsList = props => {
  const navigate = useNavigate();
  const {
    isFullList,
    rxList,
    pagination,
    selectedSortOption,
    updateLoadingStatus,
    scrollLocation,
  } = props;
  const sortOptionLowercase =
    rxListSortingOptions[selectedSortOption]?.LABEL.toLowerCase();
  const totalMedications = pagination.totalEntries;
  const prescriptionId = useSelector(selectPrescriptionId);

  const perPage = 10;

  const displaynumberOfPrescriptionsSelector =
    ".no-print [data-testid='page-total-info']";

  const onPageChange = page => {
    datadogRum.addAction(dataDogActionNames.medicationsListPage.PAGINATION);
    navigate(`/?page=${page}`, {
      replace: true,
    });
    updateLoadingStatus('Loading your medications...');
    waitForRenderThenFocus(displaynumberOfPrescriptionsSelector, document, 500);
  };

  const displayNums = fromToNumbs(
    pagination.currentPage,
    pagination.totalEntries,
    rxList?.length,
    perPage,
  );

  const selectedFilterOption = useSelector(selectFilterOption);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const currentFilterOptions = getFilterOptions(
    isCernerPilot,
    isV2StatusMapping,
  );
  const selectedFilterDisplay =
    currentFilterOptions[selectedFilterOption]?.showingContentDisplayName;

  const filterAndSortContent = () => {
    const allMedsSelected = selectedFilterOption === ALL_MEDICATIONS_FILTER_KEY;
    return (
      <>
        {!isFullList && !allMedsSelected && (
          <strong>{selectedFilterDisplay} medications</strong>
        )}
        {`${
          !isFullList && !allMedsSelected ? '' : ' medications'
        }, ${sortOptionLowercase}`}
      </>
    );
  };

  // used to create aria-label for filter and sort info (for Firefox)
  const filterAndSortAriaLabel = () => {
    const allMedsSelected = selectedFilterOption === ALL_MEDICATIONS_FILTER_KEY;
    const filterText =
      !isFullList && !allMedsSelected
        ? `${selectedFilterDisplay} medications`
        : 'medications';
    return `${filterText}, ${sortOptionLowercase}`;
  };

  return (
    <>
      <p
        className="rx-page-total-info vads-u-font-family--sans"
        data-testid="page-total-info"
        id="showingRx"
        aria-label={`Showing ${displayNums[0]} - ${
          displayNums[1]
        } of ${totalMedications} ${filterAndSortAriaLabel()}`}
      >
        <span className="no-print">
          {`Showing ${displayNums[0]} - ${displayNums[1]} of ${totalMedications} `}
          {filterAndSortContent()}
        </span>
        <span className="print-only">
          {`Showing ${totalMedications} `}
          {filterAndSortContent()}
        </span>
      </p>
      <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter" />
      <div className="print-only vads-u-margin--0 vads-u-width--full">
        {rxList?.length > 0 &&
          rxList.map((rx, idx) => <PrescriptionPrintOnly key={idx} rx={rx} />)}
      </div>
      <ul
        className="medications-list-style--none vads-u-margin--0 vads-u-padding--0 vads-u-margin-top--3"
        data-testid="medication-list"
      >
        {rxList?.length > 0 &&
          rxList.map((rx, idx) =>
            rx.prescriptionId === prescriptionId ? (
              <li ref={scrollLocation} key={idx}>
                <MedicationsListCard rx={rx} />
              </li>
            ) : (
              <li key={idx}>
                <MedicationsListCard rx={rx} />
              </li>
            ),
          )}
      </ul>
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
