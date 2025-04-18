import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { useHistory, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Actions } from '../util/actionTypes';
import RecordList from '../components/RecordList/RecordList';
import { getLabsAndTestsList, reloadRecords } from '../actions/labsAndTests';
import {
  ALERT_TYPE_ERROR,
  CernerAlertContent,
  accessAlertTypes,
  pageTitles,
  recordType,
  refreshExtractTypes,
  loadStates,
} from '../util/constants';
import { getMonthFromSelectedDate } from '../util/helpers';

import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';
import useAcceleratedData from '../hooks/useAcceleratedData';
import DatePicker from '../components/shared/DatePicker';

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
  const activeAlert = useAlerts(dispatch);
  const listState = useSelector(state => state.mr.labsAndTests.listState);
  const refresh = useSelector(state => state.mr.refresh);
  const labsAndTestsCurrentAsOf = useSelector(
    state => state.mr.labsAndTests.listCurrentAsOf,
  );

  const { isAcceleratingLabsAndTests } = useAcceleratedData();

  const urlTimeFrame = new URLSearchParams(location.search).get('timeFrame');
  const [acceleratedLabsAndTestDate, setAcceleratedLabsAndTestDate] = useState(
    urlTimeFrame || format(new Date(), 'yyyy-MM'),
  );
  const [displayDate, setDisplayDate] = useState(acceleratedLabsAndTestDate);

  const dispatchAction = useMemo(
    () => {
      return isCurrent => {
        return getLabsAndTestsList(
          isCurrent,
          isAcceleratingLabsAndTests,
          acceleratedLabsAndTestDate,
        );
      };
    },
    [isAcceleratingLabsAndTests, acceleratedLabsAndTestDate],
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
    },
    [acceleratedLabsAndTestDate, history, location.pathname, location.search],
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

      <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
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
            <div className="vads-u-margin-top--2 ">
              <hr className="vads-u-margin-y--1 vads-u-padding-0" />
              <p className="vads-u-margin--0">
                Showing labs and tests from{' '}
                <span
                  className="vads-u-font-weight--bold"
                  data-testid="current-date-display"
                >
                  {getMonthFromSelectedDate({ date: displayDate })}
                </span>
                .
              </p>
              <hr className="vads-u-margin-y--1 vads-u-padding-0" />
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
          <RecordList
            type={recordType.LABS_AND_TESTS}
            records={labsAndTests?.map(data => ({
              ...data,
              isOracleHealthData: isAcceleratingLabsAndTests,
            }))}
            domainOptions={{
              isAccelerating: isAcceleratingLabsAndTests,
              timeFrame: acceleratedLabsAndTestDate,
            }}
          />
        )}
      </RecordListSection>
    </div>
  );
};

export default LabsAndTests;
