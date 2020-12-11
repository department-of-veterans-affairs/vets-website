import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import * as actions from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FormButtons from '../../../components/FormButtons';
import { getDateTimeSelect } from '../../redux/selectors';
import CalendarWidget from '../calendar/CalendarWidget';
import WaitTimeAlert from './WaitTimeAlert';
import { FETCH_STATUS } from '../../../utils/constants';
import { getRealFacilityId } from '../../../utils/appointment';

const pageKey = 'selectDateTime';
const pageTitle = 'Tell us the date and time you’d like your appointment';

const missingDateError =
  'Please choose your preferred date and time for your appointment.';

export function getOptionsByDate(
  selectedDate,
  timezoneDescription,
  availableSlots = [],
) {
  return availableSlots.reduce((acc, slot) => {
    if (slot.start.split('T')[0] === selectedDate) {
      let time = moment(slot.start);
      if (slot.start.endsWith('Z')) {
        time = time.tz(timezoneDescription);
      }
      const meridiem = time.format('A');
      const screenReaderMeridiem = meridiem.replace(/\./g, '').toUpperCase();
      acc.push({
        value: slot.start,
        label: (
          <>
            {time.format('h:mm')} <span aria-hidden="true">{meridiem}</span>{' '}
            <span className="sr-only">{screenReaderMeridiem}</span>
          </>
        ),
      });
    }
    return acc;
  }, []);
}

function ErrorMessage({ facilityId, requestAppointmentDateChoice }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="error"
        headline="We’ve run into a problem when trying to find available appointment times"
      >
        To schedule this appointment, you can{' '}
        <button
          onClick={() => requestAppointmentDateChoice(history)}
          className="va-button-link"
        >
          submit a request for a VA appointment
        </button>{' '}
        or{' '}
        <a
          href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          call your local VA medical center
        </a>
        .
      </AlertBox>
    </div>
  );
}

function userSelectedSlot(calendarData) {
  return calendarData?.selectedDates?.length > 0;
}

function goBack({ routeToPreviousAppointmentPage, history }) {
  return routeToPreviousAppointmentPage(history, pageKey);
}

function validate({ calendarData, setValidationError }) {
  if (userSelectedSlot(calendarData)) {
    setValidationError(null);
  } else {
    setValidationError(missingDateError);
  }
}

function goForward({
  data,
  history,
  routeToNextAppointmentPage,
  submitted,
  setSubmitted,
  setValidationError,
}) {
  const { calendarData } = data || {};
  validate({ calendarData, setValidationError });
  if (userSelectedSlot(calendarData)) {
    routeToNextAppointmentPage(history, pageKey);
  } else if (submitted) {
    scrollAndFocus('.usa-input-error-message');
  } else {
    setSubmitted(true);
  }
}

export function DateTimeSelectPage({
  appointmentSlotsStatus,
  availableDates,
  availableSlots,
  data,
  eligibleForRequests,
  facilityId,
  getAppointmentSlots,
  pageChangeInProgress,
  preferredDate,
  onCalendarChange,
  routeToPreviousAppointmentPage,
  requestAppointmentDateChoice,
  routeToNextAppointmentPage,
  startRequestAppointmentFlow,
  timezone,
  timezoneDescription,
  typeOfCareId,
}) {
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    getAppointmentSlots(
      moment(preferredDate)
        .startOf('month')
        .format('YYYY-MM-DD'),
      moment(preferredDate)
        .add(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD'),
      true,
    );
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  useEffect(
    () => {
      if (validationError && submitted) {
        scrollAndFocus('.usa-input-error-message');
      }
    },
    [validationError, submitted],
  );

  const calendarData = data?.calendarData || {};
  const { currentlySelectedDate, selectedDates } = calendarData;
  const startMonth = preferredDate
    ? moment(preferredDate).format('YYYY-MM')
    : null;

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {appointmentSlotsStatus !== FETCH_STATUS.loading && (
        <WaitTimeAlert
          eligibleForRequests={eligibleForRequests}
          facilityId={facilityId}
          nextAvailableApptDate={availableSlots?.[0]?.start}
          onClickRequest={startRequestAppointmentFlow}
          preferredDate={preferredDate}
          timezone={timezoneDescription}
          typeOfCareId={typeOfCareId}
        />
      )}
      {appointmentSlotsStatus !== FETCH_STATUS.failed && (
        <p>
          Please select a desired date and time for your appointment.
          {timezone &&
            ` Appointment times are displayed in ${timezoneDescription}.`}
        </p>
      )}
      <CalendarWidget
        maxSelections={1}
        availableDates={availableDates}
        currentlySelectedDate={currentlySelectedDate}
        selectedDates={selectedDates}
        additionalOptions={{
          fieldName: 'datetime',
          required: true,
          maxSelections: 1,
          getOptionsByDate: selectedDate =>
            getOptionsByDate(selectedDate, timezone, availableSlots),
        }}
        loadingStatus={appointmentSlotsStatus}
        loadingErrorMessage={
          <ErrorMessage
            facilityId={facilityId}
            requestAppointmentDateChoice={requestAppointmentDateChoice}
          />
        }
        onChange={newData => {
          validate({ calendarData: newData, setValidationError });
          onCalendarChange(newData);
        }}
        onClickNext={getAppointmentSlots}
        onClickPrev={getAppointmentSlots}
        minDate={moment()
          .add(1, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment()
          .add(395, 'days')
          .format('YYYY-MM-DD')}
        startMonth={startMonth}
        validationError={submitted ? validationError : null}
      />
      <FormButtons
        onBack={() => goBack({ routeToPreviousAppointmentPage, history })}
        onSubmit={() =>
          goForward({
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

function mapStateToProps(state) {
  return getDateTimeSelect(state, pageKey);
}

const mapDispatchToProps = {
  getAppointmentSlots: actions.getAppointmentSlots,
  onCalendarChange: actions.onCalendarChange,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  startRequestAppointmentFlow: actions.startRequestAppointmentFlow,
  requestAppointmentDateChoice: actions.requestAppointmentDateChoice,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeSelectPage);
