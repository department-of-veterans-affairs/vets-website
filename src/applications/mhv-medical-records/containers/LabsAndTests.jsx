import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
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
import { getMonthFromSelectedDate } from '../util/helpers';

import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';
import useAcceleratedData from '../hooks/useAcceleratedData';
import DatePicker from '../components/shared/DatePicker';
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

  const urlTimeFrame = new URLSearchParams(location.search).get('timeFrame');

  // for the dropdown
  const [acceleratedLabsAndTestDate, setAcceleratedLabsAndTestDate] = useState(
    urlTimeFrame || format(new Date(), 'yyyy-MM'),
  );
  // for the display message
  const [displayDate, setDisplayDate] = useState(acceleratedLabsAndTestDate);

  // for the api call
  const timeFrameApiParameters = useMemo(
    () => {
      // set end date to the last day of the month
      const [year, month] = acceleratedLabsAndTestDate.split('-');
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const formattedMonth = month.padStart(2, '0');
      return {
        startDate: `${year}-${formattedMonth}-01`,
        endDate: `${year}-${formattedMonth}-${lastDayOfMonth}`,
      };
    },
    [acceleratedLabsAndTestDate],
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
        // Only update if there is no time frame. This is only for on initial page load.
        const timeFrame = new URLSearchParams(location.search).get('timeFrame');
        if (!timeFrame) {
          const searchParams = new URLSearchParams(location.search);
          searchParams.set('timeFrame', acceleratedLabsAndTestDate);
          history.push({
            pathname: location.pathname,
            search: searchParams.toString(),
          });
        }
      }
    },
    [
      acceleratedLabsAndTestDate,
      history,
      isAcceleratingLabsAndTests,
      location.pathname,
      location.search,
    ],
  );
  const updateDate = event => {
    const [year, month] = event.target.value.split('-');
    // Ignore transient date changes.
    if (year?.length === 4 && month?.length === 2) {
      setAcceleratedLabsAndTestDate(`${year}-${month}`);
    }
  };

  const triggerApiUpdate = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('timeFrame', acceleratedLabsAndTestDate);
    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
    setDisplayDate(acceleratedLabsAndTestDate);
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
              <DatePicker
                {...{
                  updateDate,
                  triggerApiUpdate,
                  isLoadingAcceleratedData,
                  dateValue: acceleratedLabsAndTestDate,
                }}
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
                {radRecordsWithImagesReady?.length &&
                  studyJobs?.length && (
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
                    timeFrame: acceleratedLabsAndTestDate,
                    displayTimeFrame: getMonthFromSelectedDate({
                      date: displayDate,
                    }),
                  }}
                />
              </>
            ) : (
              <NoRecordsMessage
                type={recordType.LABS_AND_TESTS}
                timeFrame={
                  isAcceleratingLabsAndTests
                    ? getMonthFromSelectedDate({
                        date: displayDate,
                      })
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
