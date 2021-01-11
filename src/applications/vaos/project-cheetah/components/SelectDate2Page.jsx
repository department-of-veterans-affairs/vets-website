import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import CalendarWidget from '../../components/calendar/CalendarWidget';
import moment from 'moment';
import { FETCH_STATUS } from '../../utils/constants';
import { getDateTimeSelect } from '../redux/selectors';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { getRealFacilityId } from '../../utils/appointment';

const pageKey = 'selectDate2';
const pageTitle = 'Select First Date';

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

function ErrorMessage({ facilityId }) {
  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="error"
        headline="We’ve run into a problem when trying to find available appointment times"
      >
        To schedule this appointment, you can{' '}
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

function goBack({ routeToPreviousAppointmentPage, history }) {
  return routeToPreviousAppointmentPage(history, pageKey);
}

function validate({ dates, setValidationError }) {
  if (dates?.length) {
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
  validate({ date: data.selectedDates2, setValidationError });
  if (data.selectedDates2?.length) {
    routeToNextAppointmentPage(history, pageKey);
  } else if (submitted) {
    scrollAndFocus('.usa-input-error-message');
  } else {
    setSubmitted(true);
  }
}

export function SelectDate2Page({
  appointmentSlotsStatus,
  availableDates,
  availableSlots,
  data,
  facilityId,
  getAppointmentSlots,
  pageChangeInProgress,
  onCalendar2Change,
  routeToPreviousAppointmentPage,
  routeToNextAppointmentPage,
  timezone,
  timezoneDescription,
}) {
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const firstAppoinmentSlot = data.selectedDates[0];
  const selectedDates2 = data.selectedDates2;

  useEffect(() => {
    getAppointmentSlots(
      moment(firstAppoinmentSlot)
        .startOf('day')
        .startOf('month')
        .format('YYYY-MM-DD'),
      moment(firstAppoinmentSlot)
        .startOf('day')
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

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
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
        value={selectedDates2}
        additionalOptions={{
          fieldName: 'datetime',
          required: true,
          maxSelections: 1,
          getOptionsByDate: selectedDate =>
            getOptionsByDate(selectedDate, timezone, availableSlots),
        }}
        loadingStatus={appointmentSlotsStatus}
        loadingErrorMessage={<ErrorMessage facilityId={facilityId} />}
        onChange={dates => {
          validate({ dates, setValidationError });
          onCalendar2Change(dates);
        }}
        onClickNext={getAppointmentSlots}
        onClickPrev={getAppointmentSlots}
        minDate={moment(firstAppoinmentSlot)
          .add(21, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment(firstAppoinmentSlot)
          .add(28, 'days')
          .format('YYYY-MM-DD')}
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
  onCalendar2Change: actions.onCalendar2Change,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  startRequestAppointmentFlow: actions.startAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectDate2Page);
