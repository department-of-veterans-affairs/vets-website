import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import AcceleratedCernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/AcceleratedCernerFacilityAlert';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import { Actions } from '../util/actionTypes';
import RecordList from '../components/RecordList/RecordList';
import {
  getLabsAndTestsList,
  reloadRecords,
  updateLabsAndTestDateRange,
} from '../actions/labsAndTests';
import {
  ALERT_TYPE_ERROR,
  DEFAULT_DATE_RANGE,
  accessAlertTypes,
  labTypes,
  pageTitles,
  recordType,
  refreshExtractTypes,
  studyJobStatus,
  loadStates,
  statsdFrontEndActions,
} from '../util/constants';
import {
  calculateDateRange,
  getTimeFrame,
  getDisplayTimeFrame,
  sendDataDogAction,
} from '../util/helpers';

import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import DateRangeSelector, {
  getDateRangeList,
} from '../components/shared/DateRangeSelector';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import { fetchImageRequestStatus } from '../actions/images';
import JobCompleteAlert from '../components/shared/JobsCompleteAlert';
import { useTrackAction } from '../hooks/useTrackAction';
import AdditionalReportsInfo from '../components/shared/AdditionalReportsInfo';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const dateRange = useSelector(state => state.mr.labsAndTests.dateRange);
  const updatedRecordList = useSelector(
    state => state.mr.labsAndTests.updatedList,
  );
  const labsAndTests = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const { imageStatus: studyJobs } = useSelector(state => state.mr.images);

  const radRecordsWithImagesReady = labsAndTests?.filter(radRecord => {
    const isRadRecord =
      radRecord?.type === labTypes.RADIOLOGY ||
      radRecord?.type === labTypes.CVIX_RADIOLOGY;
    const studyJob =
      studyJobs?.find(img => img.studyIdUrn === radRecord.studyId) || null;
    const jobComplete = studyJob?.status === studyJobStatus.COMPLETE;
    return isRadRecord && jobComplete;
  });

  const activeAlert = useAlerts(dispatch);
  const listState = useSelector(state => state.mr.labsAndTests.listState);
  const refresh = useSelector(state => state.mr.refresh);
  const labsAndTestsCurrentAsOf = useSelector(
    state => state.mr.labsAndTests.listCurrentAsOf,
  );
  useTrackAction(statsdFrontEndActions.LABS_AND_TESTS_LIST);

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus());
    },
    [dispatch],
  );

  const { isAcceleratingLabsAndTests } = useAcceleratedData();

  const dispatchAction = useMemo(
    () => {
      return isCurrent => {
        return getLabsAndTestsList(isCurrent, isAcceleratingLabsAndTests, {
          startDate: dateRange.fromDate,
          endDate: dateRange.toDate,
        });
      };
    },
    [isAcceleratingLabsAndTests, dateRange],
  );

  useListRefresh({
    listState,
    listCurrentAsOf: labsAndTestsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: [refreshExtractTypes.CHEM_HEM, refreshExtractTypes.VPR],
    dispatchAction,
    dispatch,
  });

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType: Actions.LabsAndTests.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRecords,
  });

  const isLoadingAcceleratedData =
    isAcceleratingLabsAndTests && listState === loadStates.FETCHING;

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE);
    },
    [dispatch],
  );

  const handleDateRangeSelect = useCallback(
    event => {
      const { value } = event.detail;
      const { fromDate, toDate } = calculateDateRange(value);

      // Update Redux with new range
      dispatch(updateLabsAndTestDateRange(value, fromDate, toDate));

      dispatch({
        type: Actions.LabsAndTests.UPDATE_LIST_STATE,
        payload: loadStates.PRE_FETCH,
      });

      // DataDog tracking
      const selectedOption = getDateRangeList().find(
        option => option.value === value,
      );
      const label = selectedOption ? selectedOption.label : 'Unknown';
      sendDataDogAction(`Date range option - ${label}`);
    },
    [dispatch],
  );

  return (
    <div id="labs-and-tests">
      <h1 className="page-title vads-u-margin-bottom--1">
        Lab and test results
      </h1>

      <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Most lab and test results are available{' '}
        <span className="vads-u-font-weight--bold">36 hours</span> after the lab
        confirms them. Pathology results may take{' '}
        <span className="vads-u-font-weight--bold">14 days</span> or longer to
        confirm.{' '}
      </p>

      <AcceleratedCernerFacilityAlert {...CernerAlertContent.LABS_AND_TESTS} />

      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.LABS_AND_TESTS}
        recordCount={labsAndTests?.length}
        recordType={recordType.LABS_AND_TESTS}
        listCurrentAsOf={labsAndTestsCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isAcceleratingLabsAndTests && (
          <NewRecordsIndicator
            refreshState={refresh}
            extractType={[
              refreshExtractTypes.CHEM_HEM,
              refreshExtractTypes.VPR,
            ]}
            newRecordsFound={
              Array.isArray(labsAndTests) &&
              Array.isArray(updatedRecordList) &&
              labsAndTests.length !== updatedRecordList.length
            }
            reloadFunction={() => {
              dispatch(reloadRecords());
            }}
          />
        )}
        {isAcceleratingLabsAndTests && (
          <div>
            <DateRangeSelector
              onDateRangeSelect={handleDateRangeSelect}
              selectedDate={dateRange?.option || DEFAULT_DATE_RANGE}
              isLoading={isLoadingAcceleratedData}
            />
            <AdditionalReportsInfo domainName="lab and test results" />
          </div>
        )}
        {isLoadingAcceleratedData && (
          <>
            <div className="vads-u-margin-y--8">
              <va-loading-indicator
                message="We’re loading your records."
                setFocus
                data-testid="loading-indicator"
              />
            </div>
          </>
        )}
        {!isLoadingAcceleratedData && (
          <>
            {labsAndTests?.length ? (
              <>
                {radRecordsWithImagesReady?.length > 0 &&
                  studyJobs?.length > 0 && (
                    <VaAlert
                      status="success"
                      visible
                      class="vads-u-margin-y--3 no-print"
                      role="alert"
                      data-testid="alert-images-ready"
                    >
                      <h3 className="vads-u-font-size--lg no-print">
                        Images ready
                      </h3>
                      <JobCompleteAlert
                        records={radRecordsWithImagesReady}
                        studyJobs={studyJobs}
                      />
                    </VaAlert>
                  )}

                <RecordList
                  type={recordType.LABS_AND_TESTS}
                  records={labsAndTests?.map(data => ({
                    ...data,
                    isAccelerating: isAcceleratingLabsAndTests,
                  }))}
                  domainOptions={{
                    isAccelerating: isAcceleratingLabsAndTests,
                    timeFrame: getTimeFrame(dateRange),
                    displayTimeFrame: getDisplayTimeFrame(dateRange),
                  }}
                />
              </>
            ) : (
              <NoRecordsMessage
                type={recordType.LABS_AND_TESTS}
                timeFrame={
                  isAcceleratingLabsAndTests
                    ? getDisplayTimeFrame(dateRange)
                    : ''
                }
              />
            )}
          </>
        )}
      </RecordListSection>
    </div>
  );
};

export default LabsAndTests;
