import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getVitals } from '../actions/vitals';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { recordType, vitalTypes } from '../util/constants';

const Vitals = () => {
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const [cards, setCards] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVitals());
  }, []);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [{ url: '/my-health/medical-records/', label: 'Medical records' }],
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
          vitals.find(vital => vital.type === vitalTypes.BLOOD_PRESSURE),
          vitals.find(vital => vital.type === vitalTypes.BREATHING_RATE),
          vitals.find(vital => vital.type === vitalTypes.PULSE),
          vitals.find(vital => vital.type === vitalTypes.HEIGHT),
          vitals.find(vital => vital.type === vitalTypes.TEMPERATURE),
          vitals.find(vital => vital.type === vitalTypes.WEIGHT),
        ]);
      }
    },
    [vitals],
  );

  const content = () => {
    if (cards?.length) {
      return (
        <RecordList
          records={cards}
          type={recordType.VITALS}
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
        class="loading-indicator"
      />
    );
  };

  return (
    <div className="vaccines" id="vitals">
      <h1>Vitals</h1>
      <section className="set-width-486">
        <p>Review vitals in your VA medical records.</p>
        <va-additional-info trigger="What to know about vitals">
          This is some additional info about vitals, though we are waiting on
          the Content Team to tell us what should be here...
        </va-additional-info>
      </section>
      {content()}
    </div>
  );
};

export default Vitals;
