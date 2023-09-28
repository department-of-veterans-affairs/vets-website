import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import RecordList from '../components/RecordList/RecordList';
import { getLabsAndTestsList } from '../actions/labsAndTests';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { pageTitles, recordType } from '../util/constants';
import { updatePageTitle } from '../../shared/util/helpers';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const labsAndTests = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );

  useEffect(
    () => {
      dispatch(getLabsAndTestsList());
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          { url: '/my-health/medical-records/', label: 'Medical records' },
        ]),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE);
    },
    [dispatch],
  );

  const content = () => {
    if (labsAndTests?.length > 0) {
      return (
        <RecordList records={labsAndTests} type={recordType.LABS_AND_TESTS} />
      );
    }
    if (labsAndTests?.length === 0) {
      return (
        <div className="vads-u-margin-bottom--3">
          <va-alert background-only status="info">
            You don’t have any records in Labs and tests
          </va-alert>
        </div>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
        class="loading-indicator"
      />
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
