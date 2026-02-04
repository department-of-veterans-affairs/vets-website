import {
  addDays,
  addMonths,
  isSameDay,
  isValid,
  lastDayOfMonth,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { scrollToFirstError } from 'platform/utilities/scroll';
import CalendarWidget from 'platform/shared/calendar/CalendarWidget';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { fetchFutureAppointments } from '../../../appointment-list/redux/actions';
import {
  getUpcomingAppointmentListInfo,
  selectUpcomingAppointments,
} from '../../../appointment-list/redux/selectors';
import FormButtons from '../../../components/FormButtons';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import useIsInitialLoad from '../../../hooks/useIsInitialLoad';
import { DATE_FORMATS, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getFormattedTimezoneAbbr } from '../../../utils/timezone';
import { getPageTitle } from '../../newAppointmentFlow';
import {
  getAppointmentSlots,
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  routeToRequestAppointmentPage,
} from '../../redux/actions';
import {
  getChosenClinicInfo,
  getDateTimeSelect,
  selectSelectedProvider,
} from '../../redux/selectors';
import UrgentCareLinks from '../UrgentCareLinks';

const pageKey = 'selectDateTime';

function handleClick(history, dispatch) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();
    dispatch(routeToRequestAppointmentPage(history, pageKey));
  };
}

function getAlertMessage({
  earliestDate,
  fetchFailed,
  slotAvailable,
  preferredDate,
  timezone,
}) {
  if (fetchFailed) {
    return (
      <>
        <div className="vads-u-margin-bottom--2">
          We’re sorry. There’s a problem with appointments. Refresh this page or
          try again later.
        </div>
        <div className="vads-u-margin-bottom--2">
          If that doesn’t work, you can call your local VA health care facility
          to schedule this appointment.
        </div>
      </>
    );
  }

  if (!slotAvailable) {
    return (
      <div className="vads-u-margin-bottom--2">
        To find an available date to schedule this appointment, you can call
        your local VA health care facility.
      </div>
    );
  }

  if (isValid(preferredDate) && isSameDay(preferredDate, new Date())) {
    return (
      <>
        <div className="vads-u-margin-bottom--2">
          The earliest we can schedule your appointment is{' '}
          <span className="vads-u-font-weight--bold">
            {formatInTimeZone(
              earliestDate,
              timezone,
              DATE_FORMATS.friendlyDate,
            )}{' '}
            at {formatInTimeZone(earliestDate, timezone, 'h:mm aaaa')}{' '}
            {getFormattedTimezoneAbbr(earliestDate, timezone)}
          </span>
          . If this date doesn’t work, you can pick a new one from the calendar.
        </div>
        <div className="vads-u-margin-bottom--2">
          If the date you want isn’t available, you can call your local VA
          health care facility.
        </div>
      </>
    );
  }

  return null;
}

function AlertSection({
  earliestDate,
  fetchStatus,
  history,
  preferredDate,
  requestEligible,
  slotAvailable,
  timezone,
}) {
  const fetchFailed = fetchStatus === FETCH_STATUS.failed;
  const dispatch = useDispatch();

  const alertMessage = getAlertMessage({
    earliestDate,
    fetchFailed,
    slotAvailable,
    preferredDate,
    timezone,
  });

  if (!alertMessage) {
    return null;
  }

  const alertTitle = fetchFailed
    ? 'This tool isn’t working right now'
    : 'We couldn’t find an appointment for your selected date';
  const alertStatus = fetchFailed ? 'error' : 'warning';

  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="vads-u-margin-bottom--2"
    >
      <InfoAlert status={alertStatus} level="2" headline={alertTitle}>
        {alertMessage}
        <div className="vads-u-margin-bottom--2">
          <NewTabAnchor href="/find-locations" renderAriaLabel={false}>
            Find your local VA health care facility (opens in a new tab)
          </NewTabAnchor>
        </div>
        {requestEligible && (
          <>
            <div>
              <div className="vads-u-margin-bottom--2">
                Or you can submit an appointment request online.
              </div>
              <a
                className="vads-c-action-link--blue vads-u-margin-bottom--2p5"
                href="my-health/appointments/schedule/va-request/"
                data-testid="appointment-request-link"
                onClick={handleClick(history, dispatch)}
              >
                Request an appointment
              </a>
            </div>
          </>
        )}
        <UrgentCareLinks boldText />
      </InfoAlert>
    </div>
  );
}
AlertSection.propTypes = {
  earliestDate: PropTypes.object,
  fetchStatus: PropTypes.string,
  history: PropTypes.object,
  preferredDate: PropTypes.object,
  requestEligible: PropTypes.bool,
  slotAvailable: PropTypes.bool,
  timezone: PropTypes.string,
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
  const clinic = useSelector(state => getChosenClinicInfo(state));
  const selectedProvider = useSelector(state => selectSelectedProvider(state));
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
        scrollAndFocus('h1');
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
  const startMonth = preferredDate ? parseISO(preferredDate) : null;
  const earliestDate = new Date(availableSlots?.[0]?.start);
  const slotAvailable = isValid(earliestDate);
  const disabledMessage = (
    <va-loading-indicator
      data-testid="loadingIndicator"
      set-focus
      message="Finding appointment availability..."
      label="Finding appointment availability"
    />
  );

  return (
    <div>
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vaos-calendar__page_header vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      {!loadingSlots && (
        <AlertSection
          fetchStatus={appointmentSlotsStatus}
          history={history}
          requestEligible={eligibleForRequests}
          slotAvailable={slotAvailable}
          earliestDate={earliestDate}
          preferredDate={startMonth}
          timezone={timezone}
        />
      )}
      {!fetchFailed &&
        (loadingSlots || slotAvailable) && (
          <>
            <p>
              {clinic && `Scheduling at ${clinic.serviceName}.`}
              {selectedProvider &&
                `Scheduling with ${selectedProvider.providerName}.`}
              {(clinic || selectedProvider) && timezone ? <span> </span> : null}
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
              disabledMessage={disabledMessage}
              onChange={(...args) => dispatch(onCalendarChange(...args))}
              onNextMonth={(...args) => dispatch(getAppointmentSlots(...args))}
              onPreviousMonth={(...args) =>
                dispatch(getAppointmentSlots(...args))
              }
              minDate={addDays(new Date(), 1)}
              maxDate={addDays(new Date(), 395)}
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
        displayNextButton={slotAvailable}
      />
    </div>
  );
}
