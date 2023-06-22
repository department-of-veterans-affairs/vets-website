import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getConditionsList } from '../actions/conditions';
import { RecordType } from '../util/constants';

const HealthConditions = () => {
  const conditions = useSelector(state => state.mr.conditions.conditionsList);
  // const conditions = []; // used to test use cases with no vitals on record
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getConditionsList());
  });

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [
            { url: '/my-health/medical-records/', label: 'Dashboard' },
            {
              url: '/my-health/medical-records/health-history',
              label: 'Health history',
            },
          ],
          {
            url: '/my-health/medical-records/health-conditions',
            label: 'VA health conditions',
          },
        ),
      );
    },
    [dispatch],
  );

  const content = () => {
    if (conditions?.length > 0) {
      return (
        <RecordList records={conditions} type={RecordType.HEALTH_CONDITIONS} />
      );
    }
    if (conditions?.length === 0) {
      return (
        <div className="vads-u-margin-bottom--3">
          <va-alert background-only status="info">
            You don’t have any records in Vitals
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
    <div>
      <h1>Health conditions</h1>
      <div className="set-width">
        <p>Review health conditions in your VA medical records</p>
        <va-additional-info trigger="What to know about health conditions">
          This is some additional info about health conditions, though we are
          waiting on the Content Team to tell us what should be here...
        </va-additional-info>
        {content()}
      </div>
    </div>
  );
};

export default HealthConditions;
