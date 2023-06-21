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
          [{ url: '/my-health/medical-records/', label: 'Dashboard' }],
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
      />
    );
  };

  return (
    <div id="labs-and-tests">
      <h1 className="page-title">Lab and test results</h1>
      <div className="set-width">
        <p>Review lab and test results in your VA medical records.</p>
        <va-additional-info trigger="What to know about lab and test results">
          This is some additional info about lab and test results, though we are
          waiting on the Content Team to tell us what should be here...
        </va-additional-info>

        {content()}
      </div>
    </div>
  );
};

export default LabsAndTests;
