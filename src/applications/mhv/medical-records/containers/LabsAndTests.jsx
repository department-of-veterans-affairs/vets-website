import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getLabsAndTestsList } from '../actions/labsAndTests';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { RecordType } from '../util/constants';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const labsAndTests = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );

  useEffect(() => {
    dispatch(getLabsAndTestsList());
  }, []);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [{ url: '/my-health/medical-records/', label: 'Medical records' }],
          {
            url: '/my-health/medical-records/labs-and-tests',
            label: 'Lab and test results',
          },
        ),
      );
    },
    [dispatch],
  );

  const content = () => {
    if (labsAndTests?.length > 0) {
      return (
        <RecordList records={labsAndTests} type={RecordType.LABS_AND_TESTS} />
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
      <section className="set-width-486">
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
          Most lab and test results are available <strong>36 hours</strong>{' '}
          after the lab confirms them. Pathology results may take{' '}
          <strong>14 days</strong> or longer to confirm.{' '}
        </p>
      </section>
      {content()}
    </div>
  );
};

export default LabsAndTests;
