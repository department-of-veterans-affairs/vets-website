import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { format } from 'date-fns';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  updatePageTitle,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { getVitals, reloadRecords } from '../actions/vitals';
import {
  recordType,
  vitalTypes,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
} from '../util/constants';
import { Actions } from '../util/actionTypes';
import * as Constants from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import PrintHeader from '../components/shared/PrintHeader';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import useAcceleratedData from '../hooks/useAcceleratedData';

const Vitals = () => {
  const dispatch = useDispatch();
  const updatedRecordList = useSelector(state => state.mr.vitals.updatedList);
  const listState = useSelector(state => state.mr.vitals.listState);
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const user = useSelector(state => state.user.profile);
  const refresh = useSelector(state => state.mr.refresh);
  const [cards, setCards] = useState(null);
  const [acceleratedVitalsDate, setAcceleratedVitalsDate] = useState(
    format(new Date(), 'yyyy-MM'),
  );
  const activeAlert = useAlerts(dispatch);
  const vitalsCurrentAsOf = useSelector(
    state => state.mr.vitals.listCurrentAsOf,
  );

  const { isAcceleratingVitals } = useAcceleratedData();

  const dispatchAction = isCurrent => {
    return getVitals(isCurrent, isAcceleratingVitals, acceleratedVitalsDate);
  };

  useListRefresh({
    listState,
    listCurrentAsOf: vitalsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction,
    dispatch,
  });

  useEffect(
    /**
     * @returns a callback to automatically load any new records when unmounting this component
     */
    () => {
      return () => {
        dispatch(reloadRecords());
      };
    },
    [dispatch, listState],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.VITALS_PAGE_TITLE);
    },
    [dispatch],
  );

  usePrintTitle(
    pageTitles.VITALS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  useEffect(
    () => {
      if (vitals?.length) {
        // create vital type cards based on the types of records present
        const firstOfEach = [];
        for (const [key, types] of Object.entries(vitalTypes)) {
          const firstOfType = vitals.find(item => types.includes(item.type));
          if (firstOfType) firstOfEach.push(firstOfType);
          else firstOfEach.push({ type: key, noRecords: true });
        }
        setCards(firstOfEach);
      }
    },
    [vitals],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return (
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.VITALS}
          className="vads-u-margin-bottom--9"
        />
      );
    }
    if (refresh.initialFhirLoad && !vitalsCurrentAsOf) {
      return (
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
            class="hydrated initial-fhir-load"
            message="We're loading your records for the first time. This can take up to 2 minutes. Stay on this page until your records load."
            setFocus
            data-testid="initial-fhir-loading-indicator"
          />
        </div>
      );
    }
    if (vitals?.length === 0) {
      return (
        <>
          <ul>
            <li>Blood pressure and blood oxygen level</li>
            <li>Breathing rate and heart rate</li>
            <li>Height and weight</li>
            <li>Temperature</li>
          </ul>
          <NoRecordsMessage type={recordType.VITALS} />
        </>
      );
    }
    if (cards?.length) {
      return (
        <>
          <NewRecordsIndicator
            refreshState={refresh}
            extractType={refreshExtractTypes.VPR}
            newRecordsFound={
              Array.isArray(vitals) &&
              Array.isArray(updatedRecordList) &&
              vitals.length !== updatedRecordList.length
            }
            reloadFunction={() => {
              dispatch(reloadRecords());
            }}
          />

          <RecordList
            records={cards}
            type={recordType.VITALS}
            perPage={7}
            hidePagination
          />
        </>
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

  const updateDate = event => {
    const [year, month] = event.target.value.split('-');

    // Ignore transient date changes.
    if (year.length === 4 && month.length === 2) {
      setAcceleratedVitalsDate(`${year}-${month}`);
      dispatch({
        type: Actions.Vitals.UPDATE_LIST_STATE,
        payload: Constants.loadStates.PRE_FETCH,
      });
    }
  };

  const datePicker = () => {
    return (
      <div>
        <VaDate
          label="Select a month and year"
          // Limit to current month and year
          name="vitals-date-picker"
          monthYearOnly
          value={new Date().toISOString().split('T')[0]}
          onDateChange={updateDate}
          data-testid="date-picker"
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
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--2">
        {`Vitals are basic health numbers your providers check at your
        appointments. ${vitals?.length === 0 ? 'Vitals include:' : ''}`}
      </p>
      {isAcceleratingVitals && datePicker()}
      {content()}
    </div>
  );
};

export default Vitals;
