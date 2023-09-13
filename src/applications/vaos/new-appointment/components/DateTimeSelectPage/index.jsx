import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

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
import { getDateTimeSelect, selectEligibility } from '../../redux/selectors';
import CalendarWidget from '../../../components/calendar/CalendarWidget';
import WaitTimeAlert from './WaitTimeAlert';
import { FETCH_STATUS } from '../../../utils/constants';
import { getRealFacilityId } from '../../../utils/appointment';
import NewTabAnchor from '../../../components/NewTabAnchor';
import useIsInitialLoad from '../../../hooks/useIsInitialLoad';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';

const pageKey = 'selectDateTime';
const pageTitle = 'Choose a date and time';

function renderContent({ dispatch, isRequest, facilityId, history }) {
  // Display this content when the facility is configured to accept appointment
  // request
  if (isRequest) {
    return (
      <>
        To schedule this appointment, you can{' '}
        <button
          type="button"
          onClick={() => dispatch(requestAppointmentDateChoice(history))}
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

function goForward({ dispatch, data, history, setSubmitted }) {
  setSubmitted(true);

  if (data.selectedDates?.length) {
    dispatch(routeToNextAppointmentPage(history, pageKey));
  } else {
    scrollAndFocus('.usa-input-error-message');
  }
}

export default function DateTimeSelectPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

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
  } = useSelector(state => getDateTimeSelect(state, pageKey), shallowEqual);

  const dispatch = useDispatch();
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const fetchFailed = appointmentSlotsStatus === FETCH_STATUS.failed;
  const loadingSlots =
    appointmentSlotsStatus === FETCH_STATUS.loading ||
    appointmentSlotsStatus === FETCH_STATUS.notStarted;

  const isInitialLoad = useIsInitialLoad(loadingSlots);
  const eligibility = useSelector(selectEligibility);

  useEffect(() => {
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  useEffect(
    () => {
      dispatch(
        getAppointmentSlots(
          moment(preferredDate)
            .startOf('month')
            .format('YYYY-MM-DD'),
          moment(preferredDate)
            .add(1, 'months')
            .endOf('month')
            .format('YYYY-MM-DD'),
          true,
        ),
      );
      document.title = `${pageTitle} | Veterans Affairs`;
    },
    [dispatch, preferredDate],
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

  const { selectedDates } = data;
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
            Please select an available date and time from the calendar below.
            {timezone &&
              ` Appointment times are displayed in ${timezoneDescription}.`}
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

ErrorMessage.propTypes = {
  facilityId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

DateTimeSelectPage.propTypes = {
  changeCrumb: PropTypes.func,
};
