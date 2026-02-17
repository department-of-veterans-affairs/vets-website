import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePageTitle,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';

import RecordList from '../components/RecordList/RecordList';
import { getConditionsList, reloadRecords } from '../actions/conditions';
import {
  recordType,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
  statsdFrontEndActions,
  loadStates,
} from '../util/constants';
import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useFocusAfterLoading from '../hooks/useFocusAfterLoading';
import useListRefresh from '../hooks/useListRefresh';
import useReloadResetListOnUnmount from '../hooks/useReloadResetListOnUnmount';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { useTrackAction } from '../hooks/useTrackAction';
import { Actions } from '../util/actionTypes';

const HealthConditions = () => {
  const ABOUT_THE_CODES_LABEL = 'About the codes in some condition names';
  const dispatch = useDispatch();
  const updatedRecordList = useSelector(
    state => state.mr.conditions.updatedList,
  );

  const listState = useSelector(state => state.mr.conditions.listState);
  const conditions = useSelector(state => state.mr.conditions.conditionsList);
  const activeAlert = useAlerts(dispatch);
  const refresh = useSelector(state => state.mr.refresh);
  const conditionsCurrentAsOf = useSelector(
    state => state.mr.conditions.listCurrentAsOf,
  );
  useTrackAction(statsdFrontEndActions.HEALTH_CONDITIONS_LIST);

  const { isLoading, isAcceleratingConditions } = useAcceleratedData();

  const dispatchAction = useCallback(
    isCurrent => getConditionsList(isCurrent, isAcceleratingConditions),
    [isAcceleratingConditions],
  );

  useListRefresh({
    listState,
    listCurrentAsOf: conditionsCurrentAsOf,
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
    updateListActionType: Actions.Conditions.UPDATE_LIST_STATE,
    reloadRecordsAction: reloadRecords,
  });

  useEffect(() => {
    updatePageTitle(pageTitles.HEALTH_CONDITIONS_PAGE_TITLE);
  }, [dispatch]);

  const isLoadingAcceleratedData =
    isAcceleratingConditions && listState === loadStates.FETCHING;

  useFocusAfterLoading({
    isLoading: isLoading || listState !== loadStates.FETCHED,
    isLoadingAcceleratedData,
  });

  return (
    <>
      <h1 className="vads-u-margin--0" data-testid="health-conditions">
        Health conditions
      </h1>

      <p className="page-description">
        This list includes the same information as your "VA problem list" in the
        previous My HealtheVet experience.
      </p>

      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.HEALTH_CONDITIONS}
        recordCount={conditions?.length}
        recordType={recordType.HEALTH_CONDITIONS}
        listCurrentAsOf={conditionsCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isAcceleratingConditions && (
          <NewRecordsIndicator
            refreshState={refresh}
            extractType={refreshExtractTypes.VPR}
            newRecordsFound={
              Array.isArray(conditions) &&
              Array.isArray(updatedRecordList) &&
              conditions.length !== updatedRecordList.length
            }
            reloadFunction={() => {
              dispatch(reloadRecords());
            }}
          />
        )}

        <va-additional-info
          data-dd-action-name={ABOUT_THE_CODES_LABEL}
          trigger={ABOUT_THE_CODES_LABEL}
          class="no-print vads-u-margin-bottom--3"
        >
          <p>
            Some of your health conditions may have diagnosis codes in the name
            that start with SCT or ICD. Providers use these codes to track your
            health conditions and to communicate with other providers about your
            care. If you have a question about these codes or a health
            condition, ask your provider at your next appointment.
          </p>
        </va-additional-info>
        {(isLoadingAcceleratedData || isLoading) && (
          <div className="vads-u-margin-y--8">
            <TrackedSpinner
              id="conditions-page-spinner"
              message="We’re loading your records."
              set-focus
              data-testid="accelerated-loading-indicator"
            />
          </div>
        )}
        {!isLoadingAcceleratedData &&
          !isLoading &&
          conditions !== undefined && (
            <>
              {conditions?.length ? (
                <RecordList
                  records={conditions}
                  type={recordType.HEALTH_CONDITIONS}
                />
              ) : (
                <NoRecordsMessage type={recordType.HEALTH_CONDITIONS} />
              )}
            </>
          )}
      </RecordListSection>
    </>
  );
};

export default HealthConditions;
