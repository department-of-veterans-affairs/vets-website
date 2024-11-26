import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { startOfMonth, format, addMinutes, isWithinInterval } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import CalendarWidget from '../components/calendar/CalendarWidget';
import FormLayout from '../new-appointment/components/FormLayout';
import { onCalendarChange } from '../new-appointment/redux/actions';
import FormButtons from '../components/FormButtons';
import { referral } from './temp-data/referral';
import { getSelectedDate } from '../new-appointment/redux/selectors';
import { selectUpcomingAppointments } from '../appointment-list/redux/selectors';
import { routeToNextReferralPage, routeToPreviousReferralPage } from './flow';
import { setFormCurrentPage, fetchProviderDetails } from './redux/actions';
import { selectCurrentPage, getProviderInfo } from './redux/selectors';
import { FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';

export const ChooseDateAndTime = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const selectedDate = useSelector(state => getSelectedDate(state));
  const upcomingAppointments = useSelector(state =>
    selectUpcomingAppointments(state),
  );
  const location = useLocation();
  const currentPage = useSelector(selectCurrentPage);
  const startMonth = format(startOfMonth(referral.preferredDate), 'yyyy-MM');
  const [error, setError] = useState('');
  const pageTitle = 'Schedule an appointment with your provider';
  const latestAvailableSlot = new Date(
    Math.max.apply(
      null,
      referral.slots.map(slot => {
        return new Date(slot.start);
      }),
    ),
  );
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
  const onChange = useCallback(
    value => {
      setError('');
      dispatch(onCalendarChange(value));
    },
    [dispatch],
  );

  const { provider, providerFetchStatus } = useSelector(
    state => getProviderInfo(state),
    shallowEqual,
  );

  useEffect(
    () => {
      if (providerFetchStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchProviderDetails(referral.provider));
      } else if (providerFetchStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('h1');
      } else if (providerFetchStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h2');
      }
    },
    [dispatch, providerFetchStatus],
  );
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleAppointment'));
    },
    [location, dispatch],
  );

  const onBack = () => {
    routeToPreviousReferralPage(history, currentPage, referral.id);
  };

  const onSubmit = () => {
    if (selectedDate && !error) {
      routeToNextReferralPage(history, currentPage);
    } else if (!selectedDate) {
      setError(
        'Please choose your preferred date and time for your appointment',
      );
    }
  };
  const getTzName = name => {
    return new Intl.DateTimeFormat('default', {
      timeZone: referral.timezone,
      timeZoneName: name,
    })
      .formatToParts()
      .find(({ type }) => type === 'timeZoneName').value;
  };
  const tzLong = getTzName('longGeneric');
  const tzShort = getTzName('shortGeneric');
  const hasConflict = useCallback(
    () => {
      let conflict = false;
      const selectedMonth = format(new Date(selectedDate), 'yyyy-MM');
      if (!(selectedMonth in upcomingAppointments)) {
        return conflict;
      }
      const selectedDay = format(new Date(selectedDate), 'dd');
      const monthOfApts = upcomingAppointments[selectedMonth];
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
            zonedTimeToUtc(new Date(selectedDate), referral.timezone),
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
    [selectedDate, upcomingAppointments],
  );
  useEffect(
    () => {
      if (selectedDate && upcomingAppointments && hasConflict()) {
        setError(
          'You already have an appointment at this time. Please select another day or time.',
        );
      }
    },
    [hasConflict, selectedDate, upcomingAppointments],
  );
  if (
    providerFetchStatus === FETCH_STATUS.loading ||
    providerFetchStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator message="Loading available appointments times..." />
      </div>
    );
  }

  if (providerFetchStatus === FETCH_STATUS.failed) {
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
    <FormLayout pageTitle={pageTitle}>
      <>
        <div>
          <h1>{pageTitle}</h1>
          <p>
            You or your referring VA facility selected to schedule an
            appointment online with this provider:
          </p>
          <p className="vads-u-font-weight--bold vads-u-margin--0">
            {provider.providerName}
          </p>
          <p className="vads-u-margin-top--0">{referral.typeOfCare}</p>
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
          <p>Phone: {provider.orgPhone}</p>
          <p>
            {provider.driveTime} ({provider.driveDistance})
          </p>
          <h2>Choose a date and time</h2>
          <p>
            Select an available date and time from the calendar below.
            Appointment times are displayed in {`${tzLong} (${tzShort})`}.
          </p>
        </div>
        <div>
          <CalendarWidget
            maxSelections={1}
            availableSlots={provider.slots}
            value={[selectedDate]}
            id="dateTime"
            timezone={referral.timezone}
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
            startMonth={startMonth}
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
    </FormLayout>
  );
};

export default ChooseDateAndTime;
