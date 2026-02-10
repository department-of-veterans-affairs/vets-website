import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePageTitle,
  usePrintTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';

import RecordList from '../components/RecordList/RecordList';
import { getVitals, reloadRecords } from '../actions/vitals';
import {
  recordType,
  vitalTypes,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
  loadStates,
  statsdFrontEndActions,
} from '../util/constants';
import { Actions } from '../util/actionTypes';
import useAlerts from '../hooks/use-alerts';
import useFocusAfterLoading from '../hooks/useFocusAfterLoading';
import PrintHeader from '../components/shared/PrintHeader';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import RecordListSection from '../components/shared/RecordListSection';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { useTrackAction } from '../hooks/useTrackAction';

const Vitals = () => {
  const dispatch = useDispatch();

  const updatedRecordList = useSelector(state => state.mr.vitals.updatedList);
  const listState = useSelector(state => state.mr.vitals.listState);
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const user = useSelector(state => state.user.profile);
  const refresh = useSelector(state => state.mr.refresh);

  const [cards, setCards] = useState(null);

  const activeAlert = useAlerts(dispatch);

  const vitalsCurrentAsOf = useSelector(
    state => state.mr.vitals.listCurrentAsOf,
  );

  const { isLoading, isCerner, isAcceleratingVitals } = useAcceleratedData();
  const isLoadingAcceleratedData =
    (isCerner || isAcceleratingVitals) && listState === loadStates.FETCHING;

  const dispatchAction = useCallback(
    isCurrent => getVitals(isCurrent, isCerner, isAcceleratingVitals),
    [isCerner, isAcceleratingVitals],
  );

  useTrackAction(statsdFrontEndActions.VITALS_LIST);

  useListRefresh({
    listState,
    listCurrentAsOf: vitalsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction,
    dispatch,
    isLoading,
  });

  // On Unmount: reload any newly updated records and normalize the FETCHING state.
  useReloadResetListOnUnmount({
    listState,
    dispatch,
    updateListActionType: Actions.Vitals.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRecords,
  });

  useEffect(
    () => {
      updatePageTitle(pageTitles.VITALS_PAGE_TITLE);
    },
    [dispatch],
  );

  useFocusAfterLoading({
    isLoading: isLoading || listState === loadStates.FETCHING,
    isLoadingAcceleratedData,
  });

  usePrintTitle(
    pageTitles.VITALS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const PER_PAGE = useMemo(() => {
    return Object.keys(vitalTypes).length;
  }, []);

  useEffect(
    () => {
      if (vitals?.length) {
        // create vital type cards based on the types of records present
        const firstOfEach = [];
        for (const [key, types] of Object.entries(vitalTypes)) {
          const firstOfType = vitals.find(item => types.includes(item.type));
          if (firstOfType) firstOfEach.push(firstOfType);
          else firstOfEach.push({ type: key, noRecords: true });
        }
        setCards(firstOfEach);
      }
    },
    [vitals],
  );

  return (
    <div id="vitals">
      <PrintHeader />
      <h1 data-testid="vitals" className="vads-u-margin--0">
        Vitals
      </h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--2">
        Vitals are basic health numbers your providers check at your
        appointments.
      </p>

      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.VITALS}
        recordCount={vitals?.length}
        recordType={recordType.VITALS}
        listCurrentAsOf={vitalsCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isCerner &&
          !isAcceleratingVitals && (
            <NewRecordsIndicator
              refreshState={refresh}
              extractType={refreshExtractTypes.VPR}
              newRecordsFound={
                Array.isArray(vitals) &&
                Array.isArray(updatedRecordList) &&
                vitals.length !== updatedRecordList.length
              }
              reloadFunction={() => {
                dispatch(reloadRecords());
              }}
            />
          )}
        {(isLoadingAcceleratedData || isLoading) && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="vitals-page-spinner"
              message="We’re loading your vitals."
              set-focus
              data-testid="loading-indicator"
            />
          </div>
        )}
        {!isLoadingAcceleratedData &&
          !isLoading &&
          cards !== undefined && (
            <>
              {cards?.length ? (
                <RecordList
                  records={cards}
                  type={recordType.VITALS}
                  perPage={PER_PAGE}
                  hidePagination
                  domainOptions={{
                    isAccelerating: isCerner,
                  }}
                />
              ) : (
                <NoRecordsMessage type={recordType.VITALS} />
              )}
            </>
          )}
      </RecordListSection>
    </div>
  );
};

export default Vitals;
