import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { selectHoldTimeMessagingUpdate } from '../util/selectors';
import { Actions } from '../util/actionTypes';
import RecordList from '../components/RecordList/RecordList';
import { getRadiologyList, reloadRadiologyRecords } from '../actions/radiology';
import {
  getLabsAndTestsList,
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
import { getTimeFrame, getDisplayTimeFrame } from '../util/helpers';

import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useFocusAfterLoading from '../hooks/useFocusAfterLoading';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import useDateRangeSelector from '../hooks/useDateRangeSelector';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import DateRangeSelector from '../components/shared/DateRangeSelector';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import HoldTimeInfo from '../components/shared/HoldTimeInfo';
import { fetchImageRequestStatus } from '../actions/images';
import JobCompleteAlert from '../components/shared/JobsCompleteAlert';
import { useTrackAction } from '../hooks/useTrackAction';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import AdditionalReportsInfo from '../components/shared/AdditionalReportsInfo';

const Radiology = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { isLoading, isAcceleratingLabsAndTests } = useAcceleratedData();

  // --- Non-accelerated (legacy) state from radiology reducer ---
  const legacyUpdatedRecordList = useSelector(
    state => state.mr.radiology.updatedList,
  );
  const legacyRadiologyList = useSelector(
    state => state.mr.radiology.radiologyList,
  );
  const legacyListState = useSelector(state => state.mr.radiology.listState);
  const legacyCurrentAsOf = useSelector(
    state => state.mr.radiology.listCurrentAsOf,
  );

  // --- Accelerated state from labsAndTests reducer ---
  const labsAndTestsList = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const labsAndTestsDateRange = useSelector(
    state => state.mr.labsAndTests.dateRange,
  );
  const labsAndTestsListState = useSelector(
    state => state.mr.labsAndTests.listState,
  );
  const labsAndTestsCurrentAsOf = useSelector(
    state => state.mr.labsAndTests.listCurrentAsOf,
  );
  const mergeCvixWithScdf = useSelector(
    state =>
      state.featureToggles.mhv_medical_records_merge_cvix_into_scdf ||
      state.featureToggles.mhvMedicalRecordsMergeCvixIntoScdf,
  );

  // When accelerating, filter labsAndTests to only radiology records
  const acceleratedRadiologyList = useMemo(
    () => {
      if (!isAcceleratingLabsAndTests || !labsAndTestsList) return undefined;
      return labsAndTestsList.filter(
        record => record?.type === labTypes.UNIFIED_RADIOLOGY,
      );
    },
    [isAcceleratingLabsAndTests, labsAndTestsList],
  );

  // Pick the right data source based on acceleration
  const radiologyList = isAcceleratingLabsAndTests
    ? acceleratedRadiologyList
    : legacyRadiologyList;
  const listState = isAcceleratingLabsAndTests
    ? labsAndTestsListState
    : legacyListState;
  const listCurrentAsOf = isAcceleratingLabsAndTests
    ? labsAndTestsCurrentAsOf
    : legacyCurrentAsOf;
  const dateRange = isAcceleratingLabsAndTests ? labsAndTestsDateRange : null;

  const { imageStatus: studyJobs } = useSelector(state => state.mr.images);
  const holdTimeMessagingUpdate = useSelector(selectHoldTimeMessagingUpdate);

  const radRecordsWithImagesReady = radiologyList?.filter(radRecord => {
    const isRadRecord =
      radRecord?.type === labTypes.RADIOLOGY ||
      radRecord?.type === labTypes.CVIX_RADIOLOGY;
    const studyJob =
      studyJobs?.find(img => img.studyIdUrn === radRecord.studyId) || null;
    const jobComplete = studyJob?.status === studyJobStatus.COMPLETE;
    return isRadRecord && jobComplete;
  });

  const activeAlert = useAlerts(dispatch);
  const refresh = useSelector(state => state.mr.refresh);

  useTrackAction(statsdFrontEndActions.IMAGING_RESULTS_LIST);

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus());
    },
    [dispatch],
  );

  const isLoadingAcceleratedData =
    isAcceleratingLabsAndTests && listState === loadStates.FETCHING;

  // When accelerating, dispatch the labsAndTests action (which fetches all unified records).
  // When not accelerating, dispatch the legacy radiology action.
  const dispatchAction = useCallback(
    isCurrent => {
      if (isAcceleratingLabsAndTests) {
        return getLabsAndTestsList(
          isCurrent,
          true,
          {
            startDate: labsAndTestsDateRange?.fromDate,
            endDate: labsAndTestsDateRange?.toDate,
          },
          mergeCvixWithScdf,
        );
      }
      return getRadiologyList(isCurrent);
    },
    [isAcceleratingLabsAndTests, labsAndTestsDateRange, mergeCvixWithScdf],
  );

  useListRefresh({
    listState,
    listCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: isAcceleratingLabsAndTests
      ? [refreshExtractTypes.CHEM_HEM, refreshExtractTypes.VPR]
      : refreshExtractTypes.IMAGING,
    dispatchAction,
    dispatch,
    isLoading,
  });

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  // Only relevant for the non-accelerated path.
  useReloadResetListOnUnmount({
    listState: legacyListState,
    dispatch,
    updateListActionType: Actions.Radiology.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRadiologyRecords,
  });

  useEffect(
    () => {
      updatePageTitle(pageTitles.RADIOLOGY_PAGE_TITLE);
    },
    [dispatch],
  );

  useFocusAfterLoading({
    isLoading: isLoading || listState !== loadStates.FETCHED,
    isLoadingAcceleratedData,
  });

  const handleDateRangeSelect = useDateRangeSelector({
    updateDateRangeAction: updateLabsAndTestDateRange,
    updateListStateActionType: Actions.LabsAndTests.UPDATE_LIST_STATE,
    dataDogLabel: 'Date range option',
    history,
  });

  return (
    <div id="radiology">
      <h1 className="page-title vads-u-margin-bottom--1">
        Medical imaging results
      </h1>

      {holdTimeMessagingUpdate && <HoldTimeInfo locationPhrase="here" />}
      {!holdTimeMessagingUpdate && (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Review reports from your VA imaging tests like X-rays, MRIs, and CT
          scans. Request and download your radiology images.
        </p>
      )}

      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.RADIOLOGY}
        recordCount={radiologyList?.length}
        recordType={recordType.RADIOLOGY}
        listCurrentAsOf={listCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isAcceleratingLabsAndTests && (
          <NewRecordsIndicator
            refreshState={refresh}
            extractType={refreshExtractTypes.IMAGING}
            newRecordsFound={
              Array.isArray(legacyRadiologyList) &&
              Array.isArray(legacyUpdatedRecordList) &&
              legacyRadiologyList.length !== legacyUpdatedRecordList.length
            }
            reloadFunction={() => {
              dispatch(reloadRadiologyRecords());
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
            <AdditionalReportsInfo domainName="medical imaging results" />
          </div>
        )}
        {(isLoadingAcceleratedData || isLoading) && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="radiology-page-spinner"
              message="We're loading your records."
              set-focus
              data-testid="loading-indicator"
            />
          </div>
        )}
        {!isLoadingAcceleratedData &&
          !isLoading &&
          radiologyList !== undefined && (
            <>
              {radiologyList?.length ? (
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
                        <h3
                          slot="headline"
                          className="vads-u-font-size--lg no-print"
                        >
                          Images ready
                        </h3>
                        <JobCompleteAlert
                          records={radRecordsWithImagesReady}
                          studyJobs={studyJobs}
                          basePath="/imaging-results"
                        />
                      </VaAlert>
                    )}

                  <RecordList
                    type={recordType.RADIOLOGY}
                    records={radiologyList?.map(data => ({
                      ...data,
                      isAccelerating: isAcceleratingLabsAndTests,
                    }))}
                    domainOptions={{
                      isAccelerating: isAcceleratingLabsAndTests,
                      timeFrame: dateRange ? getTimeFrame(dateRange) : '',
                      displayTimeFrame: dateRange
                        ? getDisplayTimeFrame(dateRange)
                        : '',
                    }}
                  />
                </>
              ) : (
                <NoRecordsMessage
                  type={recordType.RADIOLOGY}
                  timeFrame={
                    isAcceleratingLabsAndTests && dateRange
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

export default Radiology;
