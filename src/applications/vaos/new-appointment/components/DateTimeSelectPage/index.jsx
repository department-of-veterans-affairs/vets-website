import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addDays, addMonths, startOfMonth, endOfMonth, format } from 'date-fns';

import InfoAlert from '../../../components/InfoAlert';

import {
  getAppointmentSlots,
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  requestAppointmentDateChoice,
} from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FormButtons from '../../../components/FormButtons';
import {
  getDateTimeSelect,
  selectEligibility,
  getChosenClinicInfo,
} from '../../redux/selectors';
import CalendarWidget from '../../../components/calendar/CalendarWidget';
import WaitTimeAlert from './WaitTimeAlert';
import { FETCH_STATUS } from '../../../utils/constants';
import { getRealFacilityId } from '../../../utils/appointment';
import NewTabAnchor from '../../../components/NewTabAnchor';
import useIsInitialLoad from '../../../hooks/useIsInitialLoad';
import { getPageTitle } from '../../newAppointmentFlow';
import {
  selectUpcomingAppointments,
  getUpcomingAppointmentListInfo,
} from '../../../appointment-list/redux/selectors';
import { fetchFutureAppointments } from '../../../appointment-list/redux/actions';

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
  } else {
    scrollAndFocus('.usa-input-error-message');
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

  useEffect(
    () => {
      const prefDateObj = new Date(preferredDate);
      const startDateObj = startOfMonth(prefDateObj);
      const endDateObj = endOfMonth(addMonths(prefDateObj, 1));
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
    ? format(new Date(preferredDate), 'yyyy-MM')
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
        onSubmit={() =>
          goForward({
            dispatch,
            data,
            history,
            setSubmitted,
            isAppointmentSelectionError,
          })
        }
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
