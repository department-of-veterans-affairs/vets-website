import { addDays, addMonths, lastDayOfMonth, startOfMonth } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';
import CalendarWidget from 'platform/shared/calendar/CalendarWidget';
import FormButtons from '../../components/FormButtons';
import InfoAlert from '../../components/InfoAlert';
import NewTabAnchor from '../../components/NewTabAnchor';
import useIsInitialLoad from '../../hooks/useIsInitialLoad';
import { getRealFacilityId } from '../../utils/appointment';
import { FETCH_STATUS } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getDateTimeSelect } from '../redux/selectors';

import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../flow';
import { getAppointmentSlots, onCalendarChange } from '../redux/actions';

const pageKey = 'selectDate1';
const pageTitle = 'Choose a date and time';

const missingDateError =
  'Please choose your preferred date and time for your appointment.';

function ErrorMessage({ facilityId }) {
  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="vads-u-margin-bottom--2"
    >
      <InfoAlert
        status="error"
        level="2"
        headline="We’ve run into a problem when trying to find available appointment times"
      >
        To schedule this appointment, you can{' '}
        <NewTabAnchor
          href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
        >
          call your local VA medical center
        </NewTabAnchor>
        .
      </InfoAlert>
    </div>
  );
}
ErrorMessage.propTypes = {
  facilityId: PropTypes.string,
};

function validate({ dates, setValidationError }) {
  if (dates?.length) {
    setValidationError(null);
  } else {
    setValidationError(missingDateError);
  }
}

function goForward({
  dispatch,
  data,
  history,
  submitted,
  setSubmitted,
  setValidationError,
}) {
  validate({ date: data.date1, setValidationError });
  if (data.date1?.length) {
    dispatch(routeToNextAppointmentPage(history, pageKey));
  } else if (submitted) {
    scrollAndFocus('.usa-input-error-message');
  } else {
    setSubmitted(true);
  }
}

export default function SelectDate1Page() {
  const {
    appointmentSlotsStatus,
    availableSlots,
    data,
    facilityId,
    requestAppointmentDateChoice,
    timezone,
    timezoneDescription,
    pageChangeInProgress,
  } = useSelector(state => getDateTimeSelect(state, pageKey), shallowEqual);
  const history = useHistory();
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const selectedDates = data.date1;
  const loadingSlots =
    appointmentSlotsStatus === FETCH_STATUS.loading ||
    appointmentSlotsStatus === FETCH_STATUS.notStarted;
  const isInitialLoad = useIsInitialLoad(loadingSlots);

  useEffect(
    () => {
      const now = new Date();
      const startDateObj = startOfMonth(now);
      const endDateObj = lastDayOfMonth(addMonths(now, 1));
      dispatch(getAppointmentSlots(startDateObj, endDateObj, true));
      document.title = `${pageTitle} | Veterans Affairs`;
    },
    [dispatch],
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
    [loadingSlots, appointmentSlotsStatus, isInitialLoad],
  );

  useEffect(
    () => {
      if (validationError && submitted) {
        scrollAndFocus('.usa-input-error-message');
      }
    },
    [validationError, submitted],
  );

  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vaos-calendar__page_header vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      {appointmentSlotsStatus === FETCH_STATUS.failed && (
        <ErrorMessage
          facilityId={facilityId}
          requestAppointmentDateChoice={requestAppointmentDateChoice}
        />
      )}
      {appointmentSlotsStatus !== FETCH_STATUS.failed && (
        <>
          <p>
            {timezone && ` Appointment times are in ${timezoneDescription}.`}
          </p>
          <p>
            Note: If your vaccine requires 2 doses, you’ll need to come back for
            your second dose 3 to 4 weeks after the date you select.
          </p>
          <CalendarWidget
            maxSelections={1}
            availableSlots={availableSlots}
            value={selectedDates}
            additionalOptions={{
              fieldName: 'datetime',
              required: true,
            }}
            id="dateTime"
            timezone={timezone}
            disabled={loadingSlots}
            hideWhileDisabled
            disabledMessage={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <va-loading-indicator
                data-testid="loadingIndicator"
                set-focus
                message="Finding appointment availability..."
                label="Finding appointment availability"
              />
            }
            onChange={dates => {
              validate({ dates, setValidationError });
              dispatch(onCalendarChange(dates, pageKey));
            }}
            onNextMonth={(...args) => {
              dispatch(getAppointmentSlots(...args));
            }}
            onPreviousMonth={(...args) =>
              dispatch(getAppointmentSlots(...args))
            }
            minDate={addDays(new Date(), 1)}
            maxDate={addDays(new Date(), 395)}
            validationError={submitted ? validationError : null}
            required
            requiredMessage="Please choose your preferred date and time for your appointment"
            showValidation={submitted && !selectedDates?.length}
            showWeekends
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
            routeToNextAppointmentPage,
            submitted,
            setSubmitted,
            setValidationError,
          })
        }
        disabled={appointmentSlotsStatus === FETCH_STATUS.failed}
        pageChangeInProgress={pageChangeInProgress}
        loadingText="Page change in progress"
      />
    </div>
  );
}
