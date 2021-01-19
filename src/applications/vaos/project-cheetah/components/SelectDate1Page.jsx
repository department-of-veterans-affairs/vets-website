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

const pageKey = 'selectDate1';
const pageTitle = 'Select first date';

const missingDateError =
  'Please choose your preferred date and time for your appointment.';

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
  validate({ date: data.date1, setValidationError });
  if (data.date1?.length) {
    routeToNextAppointmentPage(history, pageKey);
  } else if (submitted) {
    scrollAndFocus('.usa-input-error-message');
  } else {
    setSubmitted(true);
  }
}

export function SelectDate1Page({
  appointmentSlotsStatus,
  availableSlots,
  data,
  facilityId,
  getAppointmentSlots,
  pageChangeInProgress,
  onCalendarChange,
  routeToPreviousAppointmentPage,
  requestAppointmentDateChoice,
  routeToNextAppointmentPage,
  timezone,
  timezoneDescription,
}) {
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const selectedDates = data.date1;

  useEffect(() => {
    getAppointmentSlots(
      moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      moment()
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
        availableSlots={availableSlots}
        value={selectedDates}
        additionalOptions={{
          fieldName: 'datetime',
          required: true,
        }}
        id="dateTime"
        timezone={timezoneDescription}
        loadingStatus={appointmentSlotsStatus}
        loadingErrorMessage={
          <ErrorMessage
            facilityId={facilityId}
            requestAppointmentDateChoice={requestAppointmentDateChoice}
          />
        }
        onChange={dates => {
          validate({ dates, setValidationError });
          onCalendarChange(dates, pageKey);
        }}
        onClickNext={getAppointmentSlots}
        onClickPrev={getAppointmentSlots}
        minDate={moment()
          .add(1, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment()
          .add(395, 'days')
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
  onCalendarChange: actions.onCalendarChange,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  startRequestAppointmentFlow: actions.startAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectDate1Page);
