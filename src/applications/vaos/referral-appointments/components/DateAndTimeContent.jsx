import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format, addMinutes, isWithinInterval } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import CalendarWidget from '../../components/calendar/CalendarWidget';
import { onCalendarChange } from '../../new-appointment/redux/actions';
import FormButtons from '../../components/FormButtons';
import { getSelectedDate } from '../../new-appointment/redux/selectors';
import { routeToNextReferralPage, routeToPreviousReferralPage } from '../flow';
import { selectCurrentPage } from '../redux/selectors';
import {
  getTimezoneDescByFacilityId,
  getTimezoneByFacilityId,
} from '../../utils/timezone';

export const DateAndTimeContent = props => {
  const { currentReferral, provider, appointmentsByMonth } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const selectedDate = useSelector(state => getSelectedDate(state));
  const currentPage = useSelector(selectCurrentPage);
  const [error, setError] = useState('');

  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.ReferringFacilityInfo.FacilityCode,
  );
  const selectedDateKey = `selected-date-referral-${currentReferral.UUID}`;
  const latestAvailableSlot = new Date(
    Math.max.apply(
      null,
      provider.slots.map(slot => {
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
    routeToNextReferralPage(history, currentPage, currentReferral.UUID);
  };
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
  return (
    <>
      <div>
        <h1 data-testid="pick-heading">
          Schedule an appointment with your provider
        </h1>
        <p>
          You or your referring VA facility selected to schedule an appointment
          online with this provider:
        </p>
        <p className="vads-u-font-weight--bold vads-u-margin--0">
          {provider.providerName}
        </p>
        <p className="vads-u-margin-top--0">{currentReferral.CategoryOfCare}</p>
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
          Select an available date and time from the calendar below. Appointment
          times are displayed in{' '}
          {`${getTimezoneDescByFacilityId(
            currentReferral.ReferringFacilityInfo.FacilityCode,
          )}`}
          .
        </p>
      </div>
      <div data-testid="cal-widget">
        <CalendarWidget
          maxSelections={1}
          availableSlots={provider.slots}
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
  );
};

DateAndTimeContent.propTypes = {
  appointmentsByMonth: PropTypes.object.isRequired,
  currentReferral: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
};

export default DateAndTimeContent;
