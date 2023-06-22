import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getVitalsList } from '../actions/vitals';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { RecordType } from '../util/constants';

const Vitals = () => {
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  // const vitals = []; // used to test use cases with no vitals on record
  const [cards, setCards] = useState(null);
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

  useEffect(
    () => {
      if (vitals?.length) {
        setCards([
          vitals.filter(
            vital => vital.name.toLowerCase() === 'blood pressure',
          )[0],
          vitals.filter(vital => vital.name.toLowerCase() === 'height')[0],
          vitals.filter(vital => vital.name.toLowerCase() === 'pain level')[0],
          vitals.filter(vital => vital.name.toLowerCase() === 'pulse rate')[0],
          vitals.filter(vital => vital.name.toLowerCase() === 'respiration')[0],
          vitals.filter(vital => vital.name.toLowerCase() === 'temperature')[0],
          vitals.filter(vital => vital.name.toLowerCase() === 'weight')[0],
        ]);
      }
    },
    [vitals],
  );

  const content = () => {
    if (cards?.length === 7) {
      return (
        <RecordList
          records={cards}
          type={RecordType.VITALS}
          perPage={7}
          hidePagination
        />
      );
    }
    if (vitals?.length === 0) {
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
    <div className="vaccines" id="vitals">
      <h1>Vitals</h1>
      <div className="set-width">
        <p>Review vitals in your VA medical records</p>
        <va-additional-info trigger="What to know about vitals">
          This is some additional info about vitals, though we are waiting on
          the Content Team to tell us what should be here...
        </va-additional-info>
        {content()}
      </div>
    </div>
  );
};

export default Vitals;
