import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { format, addMinutes, isWithinInterval } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import CalendarWidget from '../components/calendar/CalendarWidget';
import ReferralLayout from './components/ReferralLayout';
import { onCalendarChange } from '../new-appointment/redux/actions';
import FormButtons from '../components/FormButtons';
import { getSelectedDate } from '../new-appointment/redux/selectors';
import { getUpcomingAppointmentListInfo } from '../appointment-list/redux/selectors';
import { routeToNextReferralPage, routeToPreviousReferralPage } from './flow';
import { setFormCurrentPage, fetchProviderDetails } from './redux/actions';
import { fetchFutureAppointments } from '../appointment-list/redux/actions';
import { selectCurrentPage, getProviderInfo } from './redux/selectors';
import { FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import {
  getTimezoneDescByFacilityId,
  getTimezoneByFacilityId,
} from '../utils/timezone';

export const ChooseDateAndTime = props => {
  const { currentReferral } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { provider, providerFetchStatus } = useSelector(
    state => getProviderInfo(state),
    shallowEqual,
  );
  const { futureStatus, appointmentsByMonth } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );
  const selectedDate = useSelector(state => getSelectedDate(state));
  const currentPage = useSelector(selectCurrentPage);

  const [slots, setSlots] = useState(provider?.slots ?? []);
  const [latestAvailableSlot, setLatestAvailableSlot] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState('');

  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.ReferringFacilityInfo.FacilityCode,
  );
  const selectedDateKey = `selected-date-referral-${currentReferral.UUID}`;

  const fullAddress = addressObject => {
    let addressString = addressObject.street1;
    if (addressObject.street2) {
      addressString = `${addressString}, ${addressObject.street2}`;
    }
    if (addressObject.street3) {
      addressString = `${addressString}, ${addressObject.street3}`;
    }
    addressString = `${addressString}, ${addressObject.city}, ${
      addressObject.state
    }, ${addressObject.zip}`;
    return addressString;
  };

  const hasConflict = useCallback(
    () => {
      let conflict = false;
      const selectedMonth = format(new Date(selectedDate), 'yyyy-MM');
      if (!(selectedMonth in appointmentsByMonth)) {
        return conflict;
      }
      const selectedDay = format(new Date(selectedDate), 'dd');
      const monthOfApts = appointmentsByMonth[selectedMonth];
      const daysWithApts = monthOfApts.map(apt => {
        return format(new Date(apt.start), 'dd');
      });
      if (!daysWithApts.includes(selectedDay)) {
        return conflict;
      }
      const unavailableTimes = monthOfApts.map(upcomingAppointment => {
        return {
          start: zonedTimeToUtc(
            new Date(upcomingAppointment.start),
            upcomingAppointment.timezone,
          ),
          end: zonedTimeToUtc(
            addMinutes(
              new Date(upcomingAppointment.start),
              upcomingAppointment.minutesDuration,
            ),
            upcomingAppointment.timezone,
          ),
        };
      });
      unavailableTimes.forEach(range => {
        if (
          isWithinInterval(
            zonedTimeToUtc(new Date(selectedDate), facilityTimeZone),
            {
              start: range.start,
              end: range.end,
            },
          )
        ) {
          conflict = true;
        }
      });
      return conflict;
    },
    [facilityTimeZone, selectedDate, appointmentsByMonth],
  );
  const onChange = useCallback(
    value => {
      setError('');
      dispatch(onCalendarChange(value));
      sessionStorage.setItem(selectedDateKey, value);
    },
    [dispatch, selectedDateKey],
  );
  const onBack = () => {
    routeToPreviousReferralPage(history, currentPage, currentReferral.UUID);
  };
  const onSubmit = () => {
    if (error) {
      return;
    }
    if (!selectedDate) {
      setError(
        'Please choose your preferred date and time for your appointment',
      );
      return;
    }
    if (appointmentsByMonth && hasConflict()) {
      setError(
        'You already have an appointment at this time. Please select another day or time.',
      );
      return;
    }
    routeToNextReferralPage(history, currentPage);
  };

  useEffect(
    () => {
      if (provider && provider.slots.length) {
        setSlots(provider.slots);
        const latest = new Date(
          Math.max.apply(
            null,
            provider.slots.map(slot => {
              return new Date(slot.start);
            }),
          ),
        );
        setLatestAvailableSlot(latest);
      }
    },
    [provider, provider.slots],
  );
  useEffect(
    () => {
      const savedSelectedDate = sessionStorage.getItem(selectedDateKey);

      if (!savedSelectedDate) {
        return;
      }

      dispatch(onCalendarChange([savedSelectedDate]));
    },
    [dispatch, selectedDateKey],
  );
  useEffect(
    () => {
      if (
        providerFetchStatus === FETCH_STATUS.notStarted ||
        futureStatus === FETCH_STATUS.notStarted
      ) {
        if (providerFetchStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchProviderDetails(currentReferral.providerId));
        }
        if (futureStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchFutureAppointments({ includeRequests: false }));
        }
      } else if (
        providerFetchStatus === FETCH_STATUS.succeeded &&
        futureStatus === FETCH_STATUS.succeeded
      ) {
        setLoading(false);
        scrollAndFocus('h1');
      } else if (
        providerFetchStatus === FETCH_STATUS.failed ||
        futureStatus === FETCH_STATUS.failed
      ) {
        setLoading(false);
        setFailed(true);
        scrollAndFocus('h2');
      }
    },
    [currentReferral.providerId, dispatch, providerFetchStatus, futureStatus],
  );
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleAppointment'));
    },
    [location, dispatch],
  );

  if (loading) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator message="Loading available appointments times..." />
      </div>
    );
  }

  if (failed) {
    return (
      <va-alert status="error">
        <h2>"We’re sorry. We’ve run into a problem"</h2>
        <p>
          We’re having trouble getting your upcoming appointments. Please try
          again later.
        </p>
      </va-alert>
    );
  }
  return (
    <ReferralLayout hasEyebrow>
      <>
        <div>
          <h1>Schedule an appointment with your provider</h1>
          <p>
            You or your referring VA facility selected to schedule an
            appointment online with this provider:
          </p>
          <p className="vads-u-font-weight--bold vads-u-margin--0">
            {provider.providerName}
          </p>
          <p className="vads-u-margin-top--0">
            {currentReferral.CategoryOfCare}
          </p>
          <p className="vads-u-margin--0 vads-u-font-weight--bold">
            {provider.orgName}
          </p>
          <address>
            <p className="vads-u-margin--0">
              {provider.orgAddress.street1} <br />
              {provider.orgAddress.street2 && (
                <>
                  {provider.orgAddress.street2}
                  <br />
                </>
              )}
              {provider.orgAddress.street3 && (
                <>
                  {provider.orgAddress.street3}
                  <br />
                </>
              )}
              {provider.orgAddress.city}, {provider.orgAddress.state},{' '}
              {provider.orgAddress.zip}
            </p>
            <div
              data-testid="directions-link-wrapper"
              className="vads-u-display--flex vads-u-color--link-default"
            >
              <va-icon
                className="vads-u-margin-right--0p5 vads-u-color--link-default"
                icon="directions"
                size={3}
              />
              <a
                data-testid="directions-link"
                href={`https://maps.google.com?addr=Current+Location&daddr=${fullAddress(
                  provider.orgAddress,
                )}`}
                aria-label={`directions to ${provider.orgName}`}
                target="_blank"
                rel="noreferrer"
              >
                Directions
              </a>
            </div>
          </address>
          <p>
            Phone:{' '}
            <va-telephone
              contact={provider.orgPhone}
              data-testid="provider-telephone"
            />
          </p>
          <p>
            {provider.driveTime} ({provider.driveDistance})
          </p>
          <h2>Choose a date and time</h2>
          <p>
            Select an available date and time from the calendar below.
            Appointment times are displayed in{' '}
            {`${getTimezoneDescByFacilityId(
              currentReferral.ReferringFacilityInfo.FacilityCode,
            )}`}
            .
          </p>
        </div>
        <div>
          <CalendarWidget
            maxSelections={1}
            availableSlots={slots}
            value={[selectedDate]}
            id="dateTime"
            timezone={facilityTimeZone}
            additionalOptions={{
              required: true,
            }}
            // disabled={loadingSlots}
            disabledMessage={
              <va-loading-indicator
                data-testid="loadingIndicator"
                set-focus
                message="Finding appointment availability..."
              />
            }
            onChange={onChange}
            onNextMonth={null}
            onPreviousMonth={null}
            minDate={format(new Date(), 'yyyy-MM-dd')}
            maxDate={format(latestAvailableSlot, 'yyyy-MM-dd')}
            required
            requiredMessage={error}
            startMonth={format(new Date(), 'yyyy-MM')}
            showValidation={error.length > 0}
            showWeekends
            overrideMaxDays
          />
        </div>
        <FormButtons
          onBack={() => onBack()}
          onSubmit={() => onSubmit()}
          loadingText="Page change in progress"
        />
      </>
    </ReferralLayout>
  );
};

ChooseDateAndTime.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};

export default ChooseDateAndTime;
