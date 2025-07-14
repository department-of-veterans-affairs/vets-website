import {
  addDays,
  addMonths,
  format,
  lastDayOfMonth,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { scrollToFirstError } from 'platform/utilities/scroll';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import InfoAlert from '../../../components/InfoAlert';

import { fetchFutureAppointments } from '../../../appointment-list/redux/actions';
import {
  getUpcomingAppointmentListInfo,
  selectUpcomingAppointments,
} from '../../../appointment-list/redux/selectors';
import CalendarWidget from '../../../components/calendar/CalendarWidget';
import FormButtons from '../../../components/FormButtons';
import NewTabAnchor from '../../../components/NewTabAnchor';
import useIsInitialLoad from '../../../hooks/useIsInitialLoad';
import { getRealFacilityId } from '../../../utils/appointment';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getPageTitle } from '../../newAppointmentFlow';
import {
  getAppointmentSlots,
  onCalendarChange,
  requestAppointmentDateChoice,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../redux/actions';
import {
  getChosenClinicInfo,
  getDateTimeSelect,
  selectEligibility,
} from '../../redux/selectors';
import WaitTimeAlert from './WaitTimeAlert';

const pageKey = 'selectDateTime';

function renderContent({ dispatch, isRequest, facilityId, history }) {
  // Display this content when the facility is configured to accept appointment
  // request
  if (isRequest) {
    return (
      <>
        To schedule this appointment, you can{' '}
        <va-link
          className="va-button-link"
          text="submit a request for a VA appointment"
          onClick={() => dispatch(requestAppointmentDateChoice(history))}
        />{' '}
        or{' '}
        <NewTabAnchor
          href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
        >
          call your local VA medical center
        </NewTabAnchor>
        .
      </>
    );
  }

  return (
    <>
      To schedule this appointment, you can{' '}
      <NewTabAnchor
        href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
      >
        call your local VA medical center
      </NewTabAnchor>
      .
    </>
  );
}

function ErrorMessage({ eligibility, facilityId, history }) {
  const { request: isRequest } = eligibility;
  const dispatch = useDispatch();

  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="vads-u-margin-bottom--2"
    >
      <InfoAlert
        status="error"
        level="2"
        headline="We’ve run into a problem trying to find an appointment time"
      >
        {renderContent({ dispatch, isRequest, facilityId, history })}
      </InfoAlert>
    </div>
  );
}
ErrorMessage.propTypes = {
  eligibility: PropTypes.object,
  facilityId: PropTypes.string,
  history: PropTypes.object,
};

function goForward({
  dispatch,
  data,
  history,
  setSubmitted,
  isAppointmentSelectionError,
}) {
  setSubmitted(true);

  if (data.selectedDates?.length && !isAppointmentSelectionError) {
    dispatch(routeToNextAppointmentPage(history, pageKey));
  }
}

export default function DateTimeSelectPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const {
    appointmentSlotsStatus,
    availableSlots,
    data,
    eligibleForRequests,
    facilityId,
    pageChangeInProgress,
    preferredDate,
    timezone,
    timezoneDescription,
    isAppointmentSelectionError,
  } = useSelector(state => getDateTimeSelect(state, pageKey), shallowEqual);
  const { futureStatus } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  // Add a counter state to trigger focusing
  const [focusTrigger, setFocusTrigger] = useState(0);

  const fetchFailed = appointmentSlotsStatus === FETCH_STATUS.failed;
  const loadingSlots =
    appointmentSlotsStatus === FETCH_STATUS.loading ||
    appointmentSlotsStatus === FETCH_STATUS.notStarted ||
    futureStatus === FETCH_STATUS.loading ||
    futureStatus === FETCH_STATUS.notStarted;

  const isInitialLoad = useIsInitialLoad(loadingSlots);
  const eligibility = useSelector(selectEligibility);
  const clinic = useSelector(state => getChosenClinicInfo(state));
  const upcomingAppointments = useSelector(selectUpcomingAppointments);

  // Effect to focus on validation message whenever error state changes
  useEffect(
    () => {
      scrollToFirstError();
    },
    [focusTrigger],
  );

  useEffect(
    () => {
      const prefDateObj = parseISO(preferredDate);
      const startDateObj = startOfMonth(prefDateObj);
      const endDateObj = lastDayOfMonth(addMonths(prefDateObj, 1));
      dispatch(getAppointmentSlots(startDateObj, endDateObj, true));
      document.title = `${pageTitle} | Veterans Affairs`;
    },
    [dispatch, pageTitle, preferredDate],
  );

  useEffect(
    () => {
      if (
        !isInitialLoad &&
        !loadingSlots &&
        appointmentSlotsStatus !== FETCH_STATUS.failed
      ) {
        scrollAndFocus('h2');
      } else if (
        (!loadingSlots && isInitialLoad) ||
        appointmentSlotsStatus === FETCH_STATUS.failed
      ) {
        scrollAndFocus();
      }
    },
    // Intentionally leaving isInitialLoad off, because it should trigger updates, it just
    // determines which update is made
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingSlots, appointmentSlotsStatus],
  );

  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchFutureAppointments({ includeRequests: false }));
      }
    },
    [dispatch, futureStatus],
  );

  const { selectedDates } = data;
  const startMonth = preferredDate
    ? format(parseISO(preferredDate), 'yyyy-MM')
    : null;

  return (
    <div>
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vaos-calendar__page_header vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      {!loadingSlots && (
        <WaitTimeAlert
          eligibleForRequests={eligibleForRequests}
          facilityId={facilityId}
          nextAvailableApptDate={availableSlots?.[0]?.start}
          preferredDate={preferredDate}
          timezone={timezoneDescription}
        />
      )}
      {fetchFailed && (
        <ErrorMessage
          history={history}
          facilityId={facilityId}
          requestAppointmentDateChoice={(...args) =>
            dispatch(requestAppointmentDateChoice(...args))
          }
          eligibility={eligibility}
        />
      )}
      {!fetchFailed && (
        <>
          <p>
            {clinic && `Scheduling at ${clinic.serviceName}`}
            {clinic && timezone && <br />}
            {timezone && `Times are displayed in ${timezoneDescription}.`}
          </p>
          <CalendarWidget
            maxSelections={1}
            availableSlots={availableSlots}
            value={selectedDates}
            id="dateTime"
            timezone={timezone}
            additionalOptions={{
              required: true,
            }}
            disabled={loadingSlots}
            hideWhileDisabled
            disabledMessage={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <va-loading-indicator
                data-testid="loadingIndicator"
                set-focus
                message="Finding appointment availability..."
              />
            }
            onChange={(...args) => dispatch(onCalendarChange(...args))}
            onNextMonth={(...args) => dispatch(getAppointmentSlots(...args))}
            onPreviousMonth={(...args) =>
              dispatch(getAppointmentSlots(...args))
            }
            minDate={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
            maxDate={format(addDays(new Date(), 395), 'yyyy-MM-dd')}
            renderIndicator={_ => undefined}
            required
            requiredMessage="Please choose your preferred date and time for your appointment"
            startMonth={startMonth}
            showValidation={submitted && !selectedDates?.length}
            showWeekends
            upcomingAppointments={upcomingAppointments}
            isAppointmentSelectionError={isAppointmentSelectionError}
          />
        </>
      )}
      <FormButtons
        onBack={() =>
          dispatch(routeToPreviousAppointmentPage(history, pageKey))
        }
        onSubmit={() => {
          // Increment the focus trigger to force re-focusing the validation message
          setFocusTrigger(prev => prev + 1);
          goForward({
            dispatch,
            data,
            history,
            setSubmitted,
            isAppointmentSelectionError,
          });
        }}
        disabled={loadingSlots || fetchFailed}
        pageChangeInProgress={pageChangeInProgress}
        loadingText="Page change in progress"
      />
    </div>
  );
}

ErrorMessage.propTypes = {
  facilityId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};
