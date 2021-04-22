import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import CalendarWidget from '../../components/calendar/CalendarWidget';
import moment from 'moment';
import { FETCH_STATUS } from '../../utils/constants';
import {
  getDateTimeSelect,
  selectPageChangeInProgress,
} from '../redux/selectors';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { getRealFacilityId } from '../../utils/appointment';
import NewTabAnchor from '../../components/NewTabAnchor';
import useIsInitialLoad from '../../hooks/useIsInitialLoad';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import {
  getAppointmentSlots,
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';

const pageKey = 'selectDate1';
const pageTitle = 'Choose a date';

const missingDateError =
  'Please choose your preferred date and time for your appointment.';

function ErrorMessage({ facilityId }) {
  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="vads-u-margin-bottom--2"
    >
      <AlertBox
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
      </AlertBox>
    </div>
  );
}

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
    selectedFacility,
    timezone,
    timezoneDescription,
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
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);

  useEffect(
    () => {
      dispatch(
        getAppointmentSlots(
          moment()
            .startOf('month')
            .format('YYYY-MM-DD'),
          moment()
            .add(1, 'months')
            .endOf('month')
            .format('YYYY-MM-DD'),
          true,
        ),
      );
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
    [loadingSlots, appointmentSlotsStatus],
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
        <span className="schemaform-required-span vaos-calendar__page_header vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal">
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
            {timezone &&
              ` Appointment times are displayed in ${timezoneDescription}.`}
          </p>
          <p>When choosing a date, make sure:</p>
          <ul>
            <li>
              You won’t have had a flu shot or any other vaccine in the past{' '}
              <strong>2 weeks</strong>.
            </li>
            <li>
              You can return to {selectedFacility.name} for your second dose{' '}
              <strong>3 to 4 weeks after the date you select</strong>.
            </li>
          </ul>
          <CalendarWidget
            maxSelections={1}
            availableSlots={availableSlots}
            value={selectedDates}
            additionalOptions={{
              fieldName: 'datetime',
              required: true,
            }}
            id="dateTime"
            timezone={timezoneDescription}
            disabled={loadingSlots}
            disabledMessage={
              <LoadingIndicator
                setFocus
                message="Finding appointment availability..."
              />
            }
            onChange={dates => {
              validate({ dates, setValidationError });
              dispatch(onCalendarChange(dates, pageKey));
            }}
            onNextMonth={(...args) => dispatch(getAppointmentSlots(...args))}
            onPreviousMonth={(...args) =>
              dispatch(getAppointmentSlots(...args))
            }
            minDate={moment()
              .add(1, 'days')
              .format('YYYY-MM-DD')}
            maxDate={moment()
              .add(395, 'days')
              .format('YYYY-MM-DD')}
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
