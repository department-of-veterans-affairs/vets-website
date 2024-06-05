import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { getLabsAndTestsList } from '../actions/labsAndTests';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
  recordType,
  refreshExtractTypes,
} from '../util/constants';
import RecordListSection from '../components/shared/RecordListSection';
import useAlerts from '../hooks/use-alerts';
import useListRefresh from '../hooks/useListRefresh';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const labsAndTests = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const activeAlert = useAlerts(dispatch);
  const listState = useSelector(state => state.mr.labsAndTests.listState);
  const refresh = useSelector(state => state.mr.refresh);
  const labsAndTestsCurrentAsOf = useSelector(
    state => state.mr.labsAndTests.listCurrentAsOf,
  );

  useListRefresh({
    listState,
    listCurrentAsOf: labsAndTestsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getLabsAndTestsList,
    dispatch,
  });

  useEffect(
    () => {
      dispatch(setBreadcrumbs([{ url: '/', label: 'Medical records' }]));
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE);
    },
    [dispatch],
  );

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
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.LABS_AND_TESTS}
        recordCount={labsAndTests?.length}
        recordType={recordType.LABS_AND_TESTS}
        listCurrentAsOf={labsAndTestsCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        <RecordList records={labsAndTests} type={recordType.LABS_AND_TESTS} />
      </RecordListSection>
    </div>
  );
};

export default LabsAndTests;
