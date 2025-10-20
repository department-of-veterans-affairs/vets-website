import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { Actions } from '../util/actionTypes';
import RecordList from '../components/RecordList/RecordList';
import { getLabsAndTestsList, reloadRecords } from '../actions/labsAndTests';
import {
  ALERT_TYPE_ERROR,
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
  getLabsAndTestsDateRanges,
  formatDateRange,
} from '../util/helpers';

import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';
import DateRangeDropdown from '../components/shared/DateRangeDropdown';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import { fetchImageRequestStatus } from '../actions/images';
import JobCompleteAlert from '../components/shared/JobsCompleteAlert';
import { useTrackAction } from '../hooks/useTrackAction';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

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

  // Get date range options
  const dateRangeOptions = useMemo(() => getLabsAndTestsDateRanges(), []);

  // Get the current range index from URL or default to 0 (last 90 days)
  const urlRangeIndex = new URLSearchParams(location.search).get('rangeIndex');
  const initialRangeIndex = urlRangeIndex
    ? parseInt(urlRangeIndex, 10)
    : 0;

  const [selectedRangeIndex, setSelectedRangeIndex] = useState(
    initialRangeIndex,
  );
  const [displayRangeIndex, setDisplayRangeIndex] = useState(
    initialRangeIndex,
  );

  // Get the current date range parameters
  const timeFrameApiParameters = useMemo(
    () => {
      const selectedRange = dateRangeOptions[selectedRangeIndex];
      return {
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
      };
    },
    [selectedRangeIndex, dateRangeOptions],
  );

  const dispatchAction = useMemo(
    () => {
      return isCurrent => {
        return getLabsAndTestsList(
          isCurrent,
          isAcceleratingLabsAndTests,
          timeFrameApiParameters,
        );
      };
    },
    [isAcceleratingLabsAndTests, timeFrameApiParameters],
  );

  useListRefresh({
    listState,
    listCurrentAsOf: labsAndTestsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: [refreshExtractTypes.CHEM_HEM, refreshExtractTypes.VPR],
    dispatchAction,
    dispatch,
  });

  useEffect(
    /**
     * @returns a callback to automatically load any new records when unmounting this component
     */
    () => {
      return () => {
        dispatch(reloadRecords());
      };
    },
    [dispatch],
  );
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
        // Only update if there is no range index. This is only for on initial page load.
        const rangeIndex = new URLSearchParams(location.search).get(
          'rangeIndex',
        );
        if (!rangeIndex) {
          const searchParams = new URLSearchParams(location.search);
          searchParams.set('rangeIndex', selectedRangeIndex.toString());
          history.push({
            pathname: location.pathname,
            search: searchParams.toString(),
          });
        }
      }
    },
    [
      selectedRangeIndex,
      history,
      isAcceleratingLabsAndTests,
      location.pathname,
      location.search,
    ],
  );
  const onDateRangeChange = index => {
    setSelectedRangeIndex(index);
    setDisplayRangeIndex(index);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set('rangeIndex', index.toString());
    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });

    dispatch({
      type: Actions.LabsAndTests.UPDATE_LIST_STATE,
      payload: loadStates.PRE_FETCH,
    });
  };

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
          <>
            <div className="vads-u-margin-bottom--2">
              <DateRangeDropdown
                currentRange={selectedRangeIndex}
                onChange={onDateRangeChange}
                options={dateRangeOptions}
              />
            </div>
          </>
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
                    rangeIndex: selectedRangeIndex,
                    displayTimeFrame: formatDateRange(
                      dateRangeOptions[displayRangeIndex],
                    ),
                  }}
                />
              </>
            ) : (
              <NoRecordsMessage
                type={recordType.LABS_AND_TESTS}
                timeFrame={
                  isAcceleratingLabsAndTests
                    ? formatDateRange(dateRangeOptions[displayRangeIndex])
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
