import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  updatePageTitle,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import RecordList from '../components/RecordList/RecordList';
import { getVitals, reloadRecords } from '../actions/vitals';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  recordType,
  vitalTypes,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
  refreshExtractTypes,
} from '../util/constants';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import useAlerts from '../hooks/use-alerts';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import PrintHeader from '../components/shared/PrintHeader';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';

const Vitals = () => {
  const dispatch = useDispatch();
  const updatedRecordList = useSelector(state => state.mr.vitals.updatedList);
  const listState = useSelector(state => state.mr.vitals.listState);
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const user = useSelector(state => state.user.profile);
  const refresh = useSelector(state => state.mr.refresh);
  const [cards, setCards] = useState(null);
  const activeAlert = useAlerts(dispatch);
  const vitalsCurrentAsOf = useSelector(
    state => state.mr.vitals.listCurrentAsOf,
  );
  const mockPhr = useSelector(
    state => state.featureToggles.mhv_medical_records_mock_phr,
  );

  useListRefresh({
    listState,
    listCurrentAsOf: vitalsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction: getVitals,
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
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(setBreadcrumbs([{ url: '/', label: 'medical records' }]));
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
        Object.keys(vitalTypes).forEach(type => {
          const firstOfType = vitals.find(item => item.type === type);
          if (firstOfType) firstOfEach.push(firstOfType);
          else firstOfEach.push({ type, noRecords: true });
        });
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
          {!mockPhr && (
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
          )}
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
      {content()}
    </div>
  );
};

export default Vitals;
