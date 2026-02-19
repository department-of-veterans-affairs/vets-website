import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import {
  selectHoldTimeMessagingUpdate,
  selectImagesDomainFlag,
} from '../util/selectors';
import { Actions } from '../util/actionTypes';
import RecordList from '../components/RecordList/RecordList';
import {
  getLabsAndTestsList,
  getAcceleratedImagingStudiesList,
  mergeImagingStudies,
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

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const dateRange = useSelector(state => state.mr.labsAndTests.dateRange);
  const scdfImagingStudies = useSelector(
    state => state.mr.labsAndTests.scdfImagingStudies,
  );
  const scdfImagingStudiesMerged = useSelector(
    state => state.mr.labsAndTests.scdfImagingStudiesMerged,
  );
  const updatedRecordList = useSelector(
    state => state.mr.labsAndTests.updatedList,
  );
  const labsAndTestsRaw = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const showImagesDomain = useSelector(selectImagesDomainFlag);
  const { imageStatus: studyJobs } = useSelector(state => state.mr.images);
  const holdTimeMessagingUpdate = useSelector(selectHoldTimeMessagingUpdate);
  const mergeCvixWithScdf = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsMergeCvixIntoScdf
      ],
  );

  // Filter out radiology records when the images domain flag is enabled
  const filterOutRadiology = useCallback(
    list => {
      if (!showImagesDomain || !list) return list;
      return list.filter(
        record =>
          record?.type !== labTypes.RADIOLOGY &&
          record?.type !== labTypes.CVIX_RADIOLOGY,
      );
    },
    [showImagesDomain],
  );

  const labsAndTests = useMemo(() => filterOutRadiology(labsAndTestsRaw), [
    filterOutRadiology,
    labsAndTestsRaw,
  ]);

  // Also filter updatedRecordList so NewRecordsIndicator comparison is accurate
  const filteredUpdatedList = useMemo(
    () => filterOutRadiology(updatedRecordList),
    [filterOutRadiology, updatedRecordList],
  );

  const radRecordsWithImagesReady = labsAndTests?.filter(radRecord => {
    const isRadRecord =
      radRecord?.type === labTypes.RADIOLOGY ||
      radRecord?.type === labTypes.CVIX_RADIOLOGY;
    const studyJob =
      studyJobs?.find(img => img.studyIdUrn === radRecord.studyId) || null;
    const jobComplete = studyJob?.status === studyJobStatus.COMPLETE;
    return isRadRecord && jobComplete;
  });

  const warnings = useSelector(state => state.mr.labsAndTests.warnings);
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

  const { isLoading, isAcceleratingLabsAndTests } = useAcceleratedData();

  useEffect(
    /** Fetch accelerated imaging studies when accelerating labs */
    () => {
      if (isAcceleratingLabsAndTests && !isLoading) {
        dispatch(
          getAcceleratedImagingStudiesList({
            startDate: dateRange.fromDate,
            endDate: dateRange.toDate,
          }),
        );
      }
    },
    [dispatch, isAcceleratingLabsAndTests, isLoading, dateRange],
  );

  useEffect(
    /** Merge imaging studies into labs list once both are available */
    () => {
      if (
        isAcceleratingLabsAndTests &&
        labsAndTestsRaw &&
        scdfImagingStudies &&
        !scdfImagingStudiesMerged
      ) {
        dispatch(mergeImagingStudies());
      }
    },
    [
      dispatch,
      isAcceleratingLabsAndTests,
      labsAndTestsRaw,
      scdfImagingStudies,
      scdfImagingStudiesMerged,
    ],
  );

  const isLoadingAcceleratedData =
    isAcceleratingLabsAndTests && listState === loadStates.FETCHING;

  const dispatchAction = useCallback(
    isCurrent =>
      getLabsAndTestsList(
        isCurrent,
        isAcceleratingLabsAndTests,
        {
          startDate: dateRange.fromDate,
          endDate: dateRange.toDate,
        },
        mergeCvixWithScdf,
      ),
    [isAcceleratingLabsAndTests, dateRange, mergeCvixWithScdf],
  );

  useListRefresh({
    listState,
    listCurrentAsOf: labsAndTestsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: [refreshExtractTypes.CHEM_HEM, refreshExtractTypes.VPR],
    dispatchAction,
    dispatch,
    isLoading,
  });

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType: Actions.LabsAndTests.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRecords,
  });

  useEffect(
    () => {
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE);
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
    <div id="labs-and-tests">
      <h1 className="page-title vads-u-margin-bottom--1">
        Lab and test results
      </h1>

      {holdTimeMessagingUpdate && <HoldTimeInfo locationPhrase="here" />}
      {!holdTimeMessagingUpdate && (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Most lab and test results are available{' '}
          <span className="vads-u-font-weight--bold">36 hours</span> after the
          lab confirms them. Pathology results may take{' '}
          <span className="vads-u-font-weight--bold">14 days</span> or longer to
          confirm.
        </p>
      )}

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
              Array.isArray(filteredUpdatedList) &&
              labsAndTests.length !== filteredUpdatedList.length
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
        {(isLoadingAcceleratedData || isLoading) && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="labs-and-tests-page-spinner"
              message="We’re loading your records."
              set-focus
              data-testid="loading-indicator"
            />
          </div>
        )}
        {!isLoadingAcceleratedData &&
          !isLoading &&
          labsAndTests !== undefined && (
            <>
              {labsAndTests?.length ? (
                <>
                  {warnings?.length > 0 && (
                    <VaAlert
                      status="warning"
                      visible
                      class="vads-u-margin-y--3 no-print"
                      data-testid="alert-partial-records-warning"
                    >
                      <h3
                        slot="headline"
                        className="vads-u-font-size--lg no-print"
                      >
                        Some records may be incomplete
                      </h3>
                      <p>
                        We couldn\u2019t retrieve all attached documents for
                        some of your lab and test results. The records below may
                        be missing PDF reports or other files.
                      </p>
                    </VaAlert>
                  )}
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
