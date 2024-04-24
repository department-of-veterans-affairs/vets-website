import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getConditionsList } from '../actions/conditions';
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

const HealthConditions = () => {
  const listState = useSelector(state => state.mr.conditions.listState);
  const conditions = useSelector(state => state.mr.conditions.conditionsList);
  const dispatch = useDispatch();
  const activeAlert = useAlerts(dispatch);
  const refresh = useSelector(state => state.mr.refresh);
  const conditionsCurrentAsOf = useSelector(
    state => state.mr.conditions.listCurrentAsOf,
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
        <RecordList records={conditions} type={recordType.HEALTH_CONDITIONS} />
      </RecordListSection>
    </>
  );
};

export default HealthConditions;
