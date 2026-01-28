import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import CalendarWidget from 'platform/shared/calendar/CalendarWidget';

import Wrapper from '../layout/Wrapper';
import {
  setSelectedDate,
  selectSelectedDate,
  selectUuid,
} from '../redux/slices/formSlice';
import { useGetAppointmentAvailabilityQuery } from '../redux/api/vassApi';
import { useErrorFocus } from '../hooks/useErrorFocus';
import { mapAppointmentAvailabilityToSlots } from '../utils/slots';
import {
  getTimezoneDescByTimeZoneString,
  getBrowserTimezone,
} from '../utils/timezone';
import { isNotWhithinCohortError, isServerError } from '../utils/errors';

const DateTimeSelection = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const uuid = useSelector(selectUuid);
  const navigate = useNavigate();
  const {
    data: appointmentAvailability,
    isLoading: loading,
    error: appointmentAvailabilityError,
  } = useGetAppointmentAvailabilityQuery(uuid);
  const [{ error, handleSetError }] = useErrorFocus([
    '.vaos-calendar__validation-msg',
  ]);

  const timezone = getBrowserTimezone();

  const slots = mapAppointmentAvailabilityToSlots(appointmentAvailability);

  // Warn user when pressing back button
  useEffect(() => {
    const handlePopState = () => {
      // eslint-disable-next-line no-alert
      const confirmLeave = window.confirm(
        'Are you sure you want to leave? Your progress will not be saved.',
      );

      if (!confirmLeave) {
        // User cancelled - push forward to stay on page
        window.history.pushState(null, '', window.location.pathname);
      }
      // If confirmed, the back navigation has already happened naturally
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Warn user when clicking external links
  useEffect(() => {
    const handleClick = e => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Check if it's an external link
      const isExternal =
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('www.');

      if (isExternal) {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        const confirmLeave = window.confirm(
          'Are you sure you want to leave? Your progress will not be saved.',
        );

        if (confirmLeave) {
          window.location.href = href;
        }
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  // This is for loading not sure if we will need it
  const disabledMessage = null;

  const latestAvailableSlot = new Date(slots[slots.length - 1]?.end);

  const onChange = selectedDateTimes => {
    // Selecting a day on the calendar fires an onChange event with an empty array even
    // when the day is is the same as the currently selected slot time. To avoid
    // deselecting the slot, we don't save anything if the selected date times is an empty array
    const selectedSlotTime = selectedDateTimes[0];
    if (!selectedSlotTime) {
      return;
    }
    // Update selected dates and clear any previous error state
    dispatch(setSelectedDate(selectedSlotTime));
    handleSetError('');
  };

  const handleContinue = () => {
    if (!selectedDate) {
      handleSetError(
        'Please select a preferred date and time for your appointment.',
      );
      return;
    }
    navigate('/topic-selection');
  };

  return (
    <Wrapper
      pageTitle="When do you want to schedule your appointment?"
      classNames="vads-u-margin-top--4"
      testID="date-time-selection"
      required
      loading={loading}
      loadingMessage="Loading appointment availability. This may take up to 30 seconds. Please don’t refresh the page."
      errorAlert={
        isServerError(appointmentAvailabilityError) ||
        isNotWhithinCohortError(appointmentAvailabilityError)
      }
    >
      <div data-testid="content">
        <p>
          Select an available date and time from the calendar below. Appointment
          times are displayed in {getTimezoneDescByTimeZoneString(timezone)}.
        </p>
        <p>
          <strong>Note:</strong> You can schedule a appointment on a week day
          within the next 2 weeks.
        </p>
      </div>

      <CalendarWidget
        maxSelections={1}
        availableSlots={slots}
        value={selectedDate ? [selectedDate] : []}
        id="dateTime"
        timezone={timezone}
        additionalOptions={{
          required: true,
        }}
        disabledMessage={disabledMessage}
        onChange={onChange}
        onNextMonth={null}
        onPreviousMonth={null}
        minDate={new Date()}
        maxDate={latestAvailableSlot}
        required
        requiredMessage={error}
        startMonth={new Date()}
        showValidation={!!error}
        showWeekends
        overrideMaxDays
      />
      <va-button
        data-testid="continue-button"
        continue
        onClick={handleContinue}
        text={null}
      />
    </Wrapper>
  );
};

export default DateTimeSelection;
