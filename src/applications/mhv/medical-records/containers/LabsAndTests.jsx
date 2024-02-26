import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import RecordList from '../components/RecordList/RecordList';
import { getLabsAndTestsList } from '../actions/labsAndTests';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import {
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  pageTitles,
  recordType,
} from '../util/constants';
import { updatePageTitle } from '../../shared/util/helpers';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const labsAndTests = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const activeAlert = useAlerts();

  useEffect(
    () => {
      dispatch(getLabsAndTestsList());
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(setBreadcrumbs([{ url: '/', label: 'Medical records' }]));
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE);
    },
    [dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return (
        <AccessTroubleAlertBox alertType={accessAlertTypes.LABS_AND_TESTS} />
      );
    }
    if (labsAndTests?.length === 0) {
      return <NoRecordsMessage type={recordType.LABS_AND_TESTS} />;
    }
    if (labsAndTests?.length > 0) {
      return (
        <RecordList records={labsAndTests} type={recordType.LABS_AND_TESTS} />
      );
    }
    if (labsAndTests?.length === 0) {
      return <NoRecordsMessage type={recordType.LABS_AND_TESTS} />;
    }
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          message="Loading..."
          setFocus
          data-testid="loading-indicator"
        />
      </div>
    );
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
      {content()}
    </div>
  );
};

export default LabsAndTests;
