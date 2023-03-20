import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getVitalsList } from '../actions/vitals';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const Vitals = () => {
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVitalsList());
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
          { url: '/my-health/medical-records/vitals', label: 'VA vitals' },
        ),
      );
    },
    [dispatch],
  );

  const content = () => {
    if (vitals?.length) {
      return <RecordList records={vitals} type="vital" />;
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
    <div className="vaccines" id="vitals">
      <h1>Vitals</h1>
      <p>This is a complete list of vitals that the VA has on file for you.</p>

      {content()}

      <iframe
        title="contentsToPrint"
        id="contentsToPrint"
        style={{
          height: '0px',
          width: '0px',
          position: 'absolute',
          border: 'none',
        }}
      />
    </div>
  );
};

export default Vitals;
