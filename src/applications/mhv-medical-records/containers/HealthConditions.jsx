import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getConditionsList, reloadRecords } from '../actions/conditions';
import {
  recordType,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
} from '../util/constants';
import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';

const HealthConditions = () => {
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
  const mockPhr = useSelector(
    state => state.featureToggles.mhv_medical_records_mock_phr,
  );

  useListRefresh({
    listState,
    listCurrentAsOf: conditionsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getConditionsList,
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
      dispatch(setBreadcrumbs([{ url: '/', label: 'Medical records' }]));
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.HEALTH_CONDITIONS_PAGE_TITLE);
    },
    [dispatch],
  );

  return (
    <>
      <h1 className="vads-u-margin--0" data-testid="health-conditions">
        Health conditions
      </h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--3">
        Health condition records are available{' '}
        <span className="vads-u-font-weight--bold">36 hours</span> after your
        providers enter them.
      </p>
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.HEALTH_CONDITIONS}
        recordCount={conditions?.length}
        recordType={recordType.HEALTH_CONDITIONS}
        listCurrentAsOf={conditionsCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!mockPhr && (
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
          trigger="About the codes in some condition names"
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
        <RecordList records={conditions} type={recordType.HEALTH_CONDITIONS} />
      </RecordListSection>
    </>
  );
};

export default HealthConditions;
