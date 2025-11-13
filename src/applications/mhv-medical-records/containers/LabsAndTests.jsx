import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { format, subMonths } from 'date-fns';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  CernerAlertContent,
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
  getTimeFrame,
  getDisplayTimeFrame,
  sendDataDogAction,
} from '../util/helpers';

import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';
import DateRangeSelector, {
  dateRangeList,
} from '../components/shared/DateRangeSelector';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import { fetchImageRequestStatus } from '../actions/images';
import JobCompleteAlert from '../components/shared/JobsCompleteAlert';
import { useTrackAction } from '../hooks/useTrackAction';
import AdditionalAccessInfo from '../components/shared/AdditionalAccessInfo';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const dateRange = useSelector(state => state.mr.labsAndTests.dateRange);

  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE_RANGE);
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

  useEffect(
    () => {
      if (isAcceleratingLabsAndTests) {
        // Only update if there is no time frame or if it is different than the current selection.
        // This is only for on initial page load or on page refresh when redux is re-set.
        const timeFrame = new URLSearchParams(location.search).get('timeFrame');
        if (!timeFrame || timeFrame !== getTimeFrame(dateRange)) {
          const searchParams = new URLSearchParams(location.search);
          searchParams.set('timeFrame', getTimeFrame(dateRange));
          history.push({
            pathname: location.pathname,
            search: searchParams.toString(),
          });
        }
      }
    },
    [
      dateRange,
      history,
      isAcceleratingLabsAndTests,
      location.pathname,
      location.search,
    ],
  );

  // Initialize selectedDate from Redux store
  // Runs once on mount and when dateRange changes
  useEffect(
    () => {
      if (dateRange && dateRange.option) {
        setSelectedDate(dateRange.option);
      }
    },
    [dateRange],
  );

  // Update URL query parameter and trigger data pre-fetch
  const updateDateRangeParams = useCallback(
    dateRangeSelected => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('timeFrame', getTimeFrame(dateRangeSelected));
      history.push({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
      dispatch({
        type: Actions.LabsAndTests.UPDATE_LIST_STATE,
        payload: loadStates.PRE_FETCH,
      });
    },
    [location.search, location.pathname, history, dispatch],
  );

  // Handle date range selection from DateRangeSelector component
  const handleDateRangeSelect = useCallback(
    event => {
      const { value } = event.detail;
      setSelectedDate(value);

      // For predefined date ranges like 3 or 6 months
      let fromDate;
      let toDate;
      const currentDate = new Date();
      if (value.length <= 2) {
        fromDate = format(
          subMonths(currentDate, parseInt(value, 10)),
          'yyyy-MM-dd',
        );
        toDate = format(currentDate, 'yyyy-MM-dd');
      } else {
        // For year selections
        const year = value;
        fromDate = `${year}-01-01`;
        toDate = `${year}-12-31`;
      }

      // Dispatch the update once the user selects a date range
      dispatch(updateLabsAndTestDateRange(value, fromDate, toDate));

      updateDateRangeParams({ option: value, fromDate, toDate });

      // Find the label from dateRangeList
      const selectedOption = dateRangeList.find(
        option => option.value === value,
      );
      const label = selectedOption ? selectedOption.label : 'Unknown';

      sendDataDogAction(`Date range option - ${label}`);
    },
    [dispatch, updateDateRangeParams],
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
              selectedDate={selectedDate}
            />
            <AdditionalAccessInfo domainName="lab and test results" />
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
