import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { format } from 'date-fns';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  updatePageTitle,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { useHistory, useLocation } from 'react-router-dom';
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
import { getMonthFromSelectedDate } from '../util/helpers';
import { Actions } from '../util/actionTypes';
import * as Constants from '../util/constants';
import useAlerts from '../hooks/use-alerts';
import PrintHeader from '../components/shared/PrintHeader';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import useAcceleratedData from '../hooks/useAcceleratedData';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import RecordListSection from '../components/shared/RecordListSection';

const Vitals = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const updatedRecordList = useSelector(state => state.mr.vitals.updatedList);
  const listState = useSelector(state => state.mr.vitals.listState);
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const user = useSelector(state => state.user.profile);
  const refresh = useSelector(state => state.mr.refresh);

  const [cards, setCards] = useState(null);
  const urlVitalsDate = new URLSearchParams(location.search).get('timeFrame');
  const [acceleratedVitalsDate, setAcceleratedVitalsDate] = useState(
    urlVitalsDate || format(new Date(), 'yyyy-MM'),
  );
  const [displayDate, setDisplayDate] = useState(acceleratedVitalsDate);

  const activeAlert = useAlerts(dispatch);

  const vitalsCurrentAsOf = useSelector(
    state => state.mr.vitals.listCurrentAsOf,
  );

  const { isLoading, isAcceleratingVitals } = useAcceleratedData();
  const isLoadingAcceleratedData =
    isAcceleratingVitals && listState === Constants.loadStates.FETCHING;

  const dispatchAction = useMemo(() => {
    return isCurrent => {
      return getVitals(isCurrent, isAcceleratingVitals, acceleratedVitalsDate);
    };
  }, [acceleratedVitalsDate, isAcceleratingVitals]);
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

  useEffect(() => {
    focusElement(document.querySelector('h1'));
    updatePageTitle(pageTitles.VITALS_PAGE_TITLE);
  }, [dispatch]);

  useEffect(() => {
    // Only update if there is no time frame. This is only for on initial page load.
    const timeFrame = new URLSearchParams(location.search).get('timeFrame');
    if (!timeFrame) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('timeFrame', acceleratedVitalsDate);
      history.push({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  }, [acceleratedVitalsDate, history, location.pathname, location.search]);

  usePrintTitle(
    pageTitles.VITALS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const VITAL_TYPES = useMemo(() => {
    if (isAcceleratingVitals) {
      return { ...vitalTypes };
    }
    // remove PAIN_SEVERITY from the list of vital types
    const vitalTypesCopy = { ...vitalTypes };
    delete vitalTypesCopy.PAIN_SEVERITY;
    return vitalTypesCopy;
  }, [isAcceleratingVitals]);

  const PER_PAGE = useMemo(() => {
    return Object.keys(VITAL_TYPES).length;
  }, [VITAL_TYPES]);

  useEffect(() => {
    if (vitals?.length) {
      // create vital type cards based on the types of records present
      const firstOfEach = [];
      for (const [key, types] of Object.entries(VITAL_TYPES)) {
        const firstOfType = vitals.find(item => types.includes(item.type));
        if (firstOfType) firstOfEach.push(firstOfType);
        else firstOfEach.push({ type: key, noRecords: true });
      }
      setCards(firstOfEach);
    }
  }, [vitals, VITAL_TYPES]);

  const content = () => {
    return (
      <RecordListSection
        accessAlert={activeAlert && activeAlert.type === ALERT_TYPE_ERROR}
        accessAlertType={accessAlertTypes.VITALS}
        recordCount={vitals?.length}
        recordType={recordType.VITALS}
        listCurrentAsOf={vitalsCurrentAsOf}
        initialFhirLoad={refresh.initialFhirLoad}
      >
        {!isAcceleratingVitals && (
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
        {isAcceleratingVitals && (
          <div className="vads-u-margin-top--2 ">
            <hr className="vads-u-margin-y--1 vads-u-padding-0" />
            <p className="vads-u-margin--0">
              Showing most recent vitals from{' '}
              <span
                className="vads-u-font-weight--bold"
                data-testid="current-date-display"
              >
                {getMonthFromSelectedDate({ date: displayDate })}
              </span>
              .
            </p>
            <hr className="vads-u-margin-y--1 vads-u-padding-0" />
          </div>
        )}

        <RecordList
          records={cards}
          type={recordType.VITALS}
          perPage={PER_PAGE}
          hidePagination
          domainOptions={{
            isAccelerating: isAcceleratingVitals,
            timeFrame: acceleratedVitalsDate,
          }}
        />
      </RecordListSection>
    );
  };

  const updateDate = event => {
    const [year, month] = event.target.value.split('-');
    // Ignore transient date changes.
    if (year?.length === 4 && month?.length === 2) {
      setAcceleratedVitalsDate(`${year}-${month}`);
    }
  };

  const triggerApiUpdate = e => {
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('timeFrame', acceleratedVitalsDate);
    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
    setDisplayDate(acceleratedVitalsDate);
    dispatch({
      type: Actions.Vitals.UPDATE_LIST_STATE,
      payload: Constants.loadStates.PRE_FETCH,
    });
  };

  const datePicker = () => {
    return (
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <div style={{ flex: 'inherit' }}>
          <VaDate
            label="Choose a month and year"
            name="vitals-date-picker"
            monthYearOnly
            onDateChange={updateDate}
            value={acceleratedVitalsDate}
            data-testid="date-picker"
          />
        </div>
        <div className="vads-u-margin-top--2">
          <va-button
            text="Update time frame"
            onClick={triggerApiUpdate}
            disabled={isLoadingAcceleratedData}
            data-testid="update-time-frame-button"
          />
        </div>
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
        appointments.`}
      </p>

      <CernerFacilityAlert {...Constants.CernerAlertContent.VITALS} />

      {isLoading && (
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
            message="We’re loading your vitals."
            setFocus
            data-testid="loading-indicator"
          />
        </div>
      )}
      {!isLoading && (
        <>
          {isAcceleratingVitals && datePicker()}
          {isLoadingAcceleratedData && (
            <>
              <div className="vads-u-margin-y--8">
                <va-loading-indicator
                  message="We’re loading your records."
                  setFocus
                  data-testid="loading-indicator"
                />
              </div>
            </>
          )}
          {!isLoadingAcceleratedData && content()}
        </>
      )}
    </div>
  );
};

export default Vitals;
