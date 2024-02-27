import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import RecordList from '../components/RecordList/RecordList';
import { getVitals } from '../actions/vitals';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  recordType,
  vitalTypes,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
} from '../util/constants';
import { updatePageTitle } from '../../shared/util/helpers';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import PrintHeader from '../components/shared/PrintHeader';
import usePrintTitle from '../../shared/hooks/usePrintTitle';

const Vitals = () => {
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const user = useSelector(state => state.user.profile);
  const [cards, setCards] = useState(null);
  const dispatch = useDispatch();
  const activeAlert = useAlerts(dispatch);

  useEffect(
    () => {
      dispatch(getVitals());
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(setBreadcrumbs([{ url: '/', label: 'Medical records' }]));
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.VITALS_PAGE_TITLE);
    },
    [dispatch],
  );

  usePrintTitle(
    pageTitles.VITALS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    formatDateLong,
    updatePageTitle,
  );

  useEffect(
    () => {
      if (vitals?.length) {
        // create vital type cards based on the types of records present
        const firstOfEach = [];
        Object.keys(vitalTypes).forEach(type => {
          const firstOfType = vitals.find(item => item.type === type);
          if (firstOfType) firstOfEach.push(firstOfType);
        });
        setCards(firstOfEach);
      }
    },
    [vitals],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return <AccessTroubleAlertBox alertType={accessAlertTypes.VITALS} />;
    }
    if (vitals?.length === 0) {
      return <NoRecordsMessage type={recordType.VITALS} />;
    }
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
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          message="We’re loading your records. This could take up to a minute."
          setFocus
          data-testid="loading-indicator"
        />
      </div>
    );
  };

  return (
    <div id="vitals">
      <PrintHeader />
      <h1 data-testid="vitals" className="vads-u-margin--0">
        Vitals
      </h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
        Vitals are basic health numbers your providers check at your
        appointments.
      </p>
      {content()}
    </div>
  );
};

export default Vitals;
