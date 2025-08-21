import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import {
  getCareSummariesAndNotesList,
  reloadRecords,
} from '../actions/careSummariesAndNotes';
import useListRefresh from '../hooks/useListRefresh';
import {
  ALERT_TYPE_ERROR,
  CernerAlertContent,
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
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import { useTrackAction } from '../hooks/useTrackAction';
import useAcceleratedData from '../hooks/useAcceleratedData';

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
  const refresh = useSelector(state => state.mr.refresh);
  const activeAlert = useAlerts(dispatch);
  useTrackAction(statsdFrontEndActions.CARE_SUMMARIES_AND_NOTES_LIST);

  const { isAcceleratingCareNotes } = useAcceleratedData();
  const dispatchAction = useMemo(
    () => {
      return isCurrent => {
        return getCareSummariesAndNotesList(isCurrent, isAcceleratingCareNotes);
      };
    },
    [isAcceleratingCareNotes],
  );

  useListRefresh({
    listState,
    listCurrentAsOf: careSummariesAndNotesCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
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

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.CARE_SUMMARIES_AND_NOTES_PAGE_TITLE);
    },
    [dispatch],
  );

  const isLoadingAcceleratedData =
    isAcceleratingCareNotes && listState === loadStates.FETCHING;

  return (
    <div id="care-summaries-and-notes">
      <h1 data-testid="care-summaries-and-notes" className="page-title">
        Care summaries and notes
      </h1>

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
        {!isLoadingAcceleratedData && careSummariesAndNotes?.length ? (
          <RecordList
            records={careSummariesAndNotes}
            domainOptions={{
              isAcceleratingCareNotes,
            }}
            type="care summaries and notes"
            hideRecordsLabel
          />
        ) : (
          <NoRecordsMessage type={recordType.CARE_SUMMARIES_AND_NOTES} />
        )}
      </RecordListSection>
    </div>
  );
};

export default CareSummariesAndNotes;
