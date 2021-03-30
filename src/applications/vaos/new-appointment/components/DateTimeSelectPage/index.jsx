import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import * as actions from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FormButtons from '../../../components/FormButtons';
import { getDateTimeSelect } from '../../redux/selectors';
import CalendarWidget from '../../../components/calendar/CalendarWidget';
import WaitTimeAlert from './WaitTimeAlert';
import { FETCH_STATUS } from '../../../utils/constants';
import { getRealFacilityId } from '../../../utils/appointment';
import NewTabAnchor from '../../../components/NewTabAnchor';
import useIsInitialLoad from '../../../hooks/useIsInitialLoad';

const pageKey = 'selectDateTime';
const pageTitle = 'Tell us the date and time you’d like your appointment';

function ErrorMessage({ facilityId, requestAppointmentDateChoice, history }) {
  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="vads-u-margin-bottom--2"
    >
      <AlertBox
        status="error"
        level="2"
        headline="We’ve run into a problem trying to find an appointment time"
      >
        To schedule this appointment, you can{' '}
        <button
          onClick={() => requestAppointmentDateChoice(history)}
          className="va-button-link"
        >
          submit a request for a VA appointment
        </button>{' '}
        or{' '}
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

function goBack({ routeToPreviousAppointmentPage, history }) {
  return routeToPreviousAppointmentPage(history, pageKey);
}

function goForward({
  data,
  history,
  routeToNextAppointmentPage,
  setSubmitted,
}) {
  setSubmitted(true);

  if (data.selectedDates?.length) {
    routeToNextAppointmentPage(history, pageKey);
  } else {
    scrollAndFocus('.usa-input-error-message');
  }
}

export function DateTimeSelectPage({
  appointmentSlotsStatus,
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
  const fetchFailed = appointmentSlotsStatus === FETCH_STATUS.failed;
  const loadingSlots =
    appointmentSlotsStatus === FETCH_STATUS.loading ||
    appointmentSlotsStatus === FETCH_STATUS.notStarted;

  const isInitialLoad = useIsInitialLoad(loadingSlots);

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
  }, []);

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
    [isInitialLoad, loadingSlots, appointmentSlotsStatus],
  );

  const selectedDates = data.selectedDates;
  const startMonth = preferredDate
    ? moment(preferredDate).format('YYYY-MM')
    : null;

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!loadingSlots && (
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
      {fetchFailed && (
        <ErrorMessage
          history={history}
          facilityId={facilityId}
          requestAppointmentDateChoice={requestAppointmentDateChoice}
        />
      )}
      {!fetchFailed && (
        <>
          <p>
            Please select a desired date and time for your appointment.
            {timezone &&
              ` Appointment times are displayed in ${timezoneDescription}.`}
          </p>
          <CalendarWidget
            maxSelections={1}
            availableSlots={availableSlots}
            value={selectedDates}
            id="dateTime"
            timezone={timezoneDescription}
            additionalOptions={{
              required: true,
            }}
            disabled={loadingSlots}
            disabledMessage={
              <LoadingIndicator
                setFocus
                message="Finding appointment availability..."
              />
            }
            onChange={onCalendarChange}
            onNextMonth={getAppointmentSlots}
            onPreviousMonth={getAppointmentSlots}
            minDate={moment()
              .add(1, 'days')
              .format('YYYY-MM-DD')}
            maxDate={moment()
              .add(395, 'days')
              .format('YYYY-MM-DD')}
            required
            requiredMessage="Please choose your preferred date and time for your appointment"
            startMonth={startMonth}
            showValidation={submitted && !selectedDates?.length}
          />
        </>
      )}
      <FormButtons
        onBack={() => goBack({ routeToPreviousAppointmentPage, history })}
        onSubmit={() =>
          goForward({
            data,
            history,
            routeToNextAppointmentPage,
            setSubmitted,
          })
        }
        disabled={loadingSlots || fetchFailed}
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
