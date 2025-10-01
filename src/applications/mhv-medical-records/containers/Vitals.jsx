import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { format } from 'date-fns';
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
  loadStates,
  statsdFrontEndActions,
  CernerAlertContent,
} from '../util/constants';
import { Actions } from '../util/actionTypes';
import useAlerts from '../hooks/use-alerts';
import PrintHeader from '../components/shared/PrintHeader';
import useListRefresh from '../hooks/useListRefresh';
import NewRecordsIndicator from '../components/shared/NewRecordsIndicator';
import useAcceleratedData from '../hooks/useAcceleratedData';
import AcceleratedCernerFacilityAlert from '../components/shared/AcceleratedCernerFacilityAlert';
import RecordListSection from '../components/shared/RecordListSection';
import DatePicker from '../components/shared/DatePicker';
import NoRecordsMessage from '../components/shared/NoRecordsMessage';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { useTrackAction } from '../hooks/useTrackAction';

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
  // Change state to be year focused. Store full value as YYYY for selector but keep acceleratedVitalsDateMonthFormat as YYYY-MM (first month) for API compatibility
  const currentYear = format(new Date(), 'yyyy');
  const initialYear =
    (urlVitalsDate && urlVitalsDate.split('-')[0]) || currentYear;
  const [acceleratedVitalsYear, setAcceleratedVitalsYear] = useState(
    initialYear,
  );
  // maintain legacy variable (first month of year) for existing downstream logic expecting YYYY-MM
  const acceleratedVitalsDate = `${acceleratedVitalsYear}-01`;
  const [displayYear, setDisplayYear] = useState(acceleratedVitalsYear);

  const activeAlert = useAlerts(dispatch);

  const vitalsCurrentAsOf = useSelector(
    state => state.mr.vitals.listCurrentAsOf,
  );

  const { isLoading, isAcceleratingVitals } = useAcceleratedData();
  const isLoadingAcceleratedData =
    isAcceleratingVitals && listState === loadStates.FETCHING;

  const dispatchAction = useMemo(
    () => {
      return isCurrent => {
        return getVitals(
          isCurrent,
          isAcceleratingVitals,
          acceleratedVitalsDate,
        );
      };
    },
    [acceleratedVitalsDate, isAcceleratingVitals],
  );

  useTrackAction(statsdFrontEndActions.VITALS_LIST);

  useListRefresh({
    listState,
    listCurrentAsOf: vitalsCurrentAsOf,
    refreshStatus: refresh.status,
    extractType: refreshExtractTypes.VPR,
    dispatchAction,
    dispatch,
  });

  useEffect(
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

  useEffect(
    () => {
      if (isAcceleratingVitals) {
        const timeFrame = new URLSearchParams(location.search).get('timeFrame');
        if (!timeFrame) {
          const searchParams = new URLSearchParams(location.search);
          searchParams.set('timeFrame', acceleratedVitalsDate);
          history.push({
            pathname: location.pathname,
            search: searchParams.toString(),
          });
        }
      }
    },
    [
      acceleratedVitalsDate,
      history,
      isAcceleratingVitals,
      location.pathname,
      location.search,
    ],
  );

  usePrintTitle(
    pageTitles.VITALS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const PER_PAGE = useMemo(() => {
    return Object.keys(vitalTypes).length;
  }, []);

  useEffect(
    () => {
      if (vitals?.length) {
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
              Showing vitals for{' '}
              <span
                className="vads-u-font-weight--bold"
                data-testid="current-date-display"
              >
                {displayYear}
              </span>
              .
            </p>
            <hr className="vads-u-margin-y--1 vads-u-padding-0" />
          </div>
        )}
        {cards?.length ? (
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
        ) : (
          <NoRecordsMessage type={recordType.VITALS} />
        )}
      </RecordListSection>
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

      <AcceleratedCernerFacilityAlert {...CernerAlertContent.VITALS} />

      {isLoading && (
        <div className="vads-u-margin-y--8">
          <TrackedSpinner
            id="vitals-page-spinner"
            message="We’re loading your vitals."
            setFocus
            data-testid="loading-indicator"
          />
        </div>
      )}
      {!isLoading && (
        <>
          {isAcceleratingVitals && (
            <>
              <DatePicker
                {...{
                  updateDate: e => {
                    const [year] = e.target.value.split('-');
                    setAcceleratedVitalsYear(year);
                  },
                  triggerApiUpdate: e => {
                    e.preventDefault();
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.set(
                      'timeFrame',
                      `${acceleratedVitalsYear}-01`,
                    );
                    history.push({
                      pathname: location.pathname,
                      search: searchParams.toString(),
                    });
                    setDisplayYear(acceleratedVitalsYear);
                    dispatch({
                      type: Actions.Vitals.UPDATE_LIST_STATE,
                      payload: loadStates.PRE_FETCH,
                    });
                  },
                  isLoadingAcceleratedData,
                  dateValue: acceleratedVitalsYear,
                  yearOnly: true,
                }}
              />
            </>
          )}
          {isLoadingAcceleratedData && (
            <>
              <div className="vads-u-margin-y--8">
                <TrackedSpinner
                  id="accelerated-vitals-page-spinner"
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
