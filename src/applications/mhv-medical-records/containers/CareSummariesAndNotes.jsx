import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';

import AcceleratedCernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/AcceleratedCernerFacilityAlert';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import RecordList from '../components/RecordList/RecordList';
import {
  getCareSummariesAndNotesList,
  reloadRecords,
  updateNotesDateRange,
} from '../actions/careSummariesAndNotes';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import {
  ALERT_TYPE_ERROR,
  DEFAULT_DATE_RANGE,
  accessAlertTypes,
  pageTitles,
  recordType,
  loadStates,
  refreshExtractTypes,
  statsdFrontEndActions,
} from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import RecordListSection from '../components/shared/RecordListSection';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import DateRangeSelector, {
  getDateRangeList,
} from '../components/shared/DateRangeSelector';
import AdditionalReportsInfo from '../components/shared/AdditionalReportsInfo';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { useTrackAction } from '../hooks/useTrackAction';
import { Actions } from '../util/actionTypes';
import {
  calculateDateRange,
  getTimeFrame,
  getDisplayTimeFrame,
  sendDataDogAction,
} from '../util/helpers';

const CareSummariesAndNotes = () => {
  const dispatch = useDispatch();
  const updatedRecordList = useSelector(
    state => state.mr.careSummariesAndNotes.updatedList,
  );
  const careSummariesAndNotes = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesList,
  );
  const careSummariesAndNotesCurrentAsOf = useSelector(
    state => state.mr.careSummariesAndNotes.listCurrentAsOf,
  );
  const listState = useSelector(
    state => state.mr.careSummariesAndNotes.listState,
  );

  const dateRange = useSelector(
    state => state.mr.careSummariesAndNotes.dateRange,
  );

  const refresh = useSelector(state => state.mr.refresh);
  const activeAlert = useAlerts(dispatch);
  useTrackAction(statsdFrontEndActions.CARE_SUMMARIES_AND_NOTES_LIST);

  const { isLoading, isAcceleratingCareNotes } = useAcceleratedData();

  const dispatchAction = useMemo(
    () => {
      return isCurrent => {
        return getCareSummariesAndNotesList(
          isCurrent,
          isAcceleratingCareNotes,
          {
            startDate: dateRange.fromDate,
            endDate: dateRange.toDate,
          },
        );
      };
    },
    [isAcceleratingCareNotes, dateRange],
  );

  useListRefresh({
    listState,
    listCurrentAsOf: careSummariesAndNotesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction,
    dispatch,
  });

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRecords,
  });

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.CARE_SUMMARIES_AND_NOTES_PAGE_TITLE);
    },
    [dispatch],
  );

  const isLoadingAcceleratedData =
    isAcceleratingCareNotes && listState === loadStates.FETCHING;

  // Handle date range selection from DateRangeSelector component
  const handleDateRangeSelect = useCallback(
    event => {
      const { value } = event.detail;
      const { fromDate, toDate } = calculateDateRange(value);

      // Update Redux with new range
      dispatch(updateNotesDateRange(value, fromDate, toDate));

      dispatch({
        type: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
        payload: loadStates.PRE_FETCH,
      });

      // DataDog tracking
      const selectedOption = getDateRangeList().find(
        option => option.value === value,
      );
      const label = selectedOption ? selectedOption.label : 'Unknown';
      sendDataDogAction(`Notes date option - ${label}`);
    },
    [dispatch],
  );

  return (
    <div id="care-summaries-and-notes">
      <h1 data-testid="care-summaries-and-notes" className="page-title">
        Care summaries and notes
      </h1>

      {isAcceleratingCareNotes && (
        <div>
          <DateRangeSelector
            onDateRangeSelect={handleDateRangeSelect}
            selectedDate={dateRange?.option || DEFAULT_DATE_RANGE}
            isLoading={isLoadingAcceleratedData}
          />
          <AdditionalReportsInfo domainName="care summaries and notes" />
        </div>
      )}

      {!isAcceleratingCareNotes && (
        <p>This list doesn’t include care summaries from before 2013.</p>
      )}

      <AcceleratedCernerFacilityAlert
        {...CernerAlertContent.CARE_SUMMARIES_AND_NOTES}
      />

      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.CARE_SUMMARIES_AND_NOTES}
        recordCount={careSummariesAndNotes?.length}
        recordType={recordType.CARE_SUMMARIES_AND_NOTES}
        listCurrentAsOf={careSummariesAndNotesCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isAcceleratingCareNotes && (
          <NewRecordsIndicator
            refreshState={refresh}
            extractType={refreshExtractTypes.VPR}
            newRecordsFound={
              Array.isArray(careSummariesAndNotes) &&
              Array.isArray(updatedRecordList) &&
              careSummariesAndNotes.length !== updatedRecordList.length
            }
            reloadFunction={() => {
              dispatch(reloadRecords());
            }}
          />
        )}
        {(isLoadingAcceleratedData || isLoading) && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="notes-page-spinner"
              message="We’re loading your records."
              setFocus
              data-testid="loading-indicator"
            />
          </div>
        )}
        {!isLoadingAcceleratedData &&
        !isLoading &&
        careSummariesAndNotes?.length ? (
          <RecordList
            records={careSummariesAndNotes}
            domainOptions={{
              isAccelerating: isAcceleratingCareNotes,
              timeFrame: getTimeFrame(dateRange),
              displayTimeFrame: getDisplayTimeFrame(dateRange),
            }}
            type="care summaries and notes"
            hideRecordsLabel
          />
        ) : (
          <NoRecordsMessage
            type={recordType.CARE_SUMMARIES_AND_NOTES}
            timeFrame={
              isAcceleratingCareNotes ? getDisplayTimeFrame(dateRange) : ''
            }
          />
        )}
      </RecordListSection>
    </div>
  );
};

export default CareSummariesAndNotes;
