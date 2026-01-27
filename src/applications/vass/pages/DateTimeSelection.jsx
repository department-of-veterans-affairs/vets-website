import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import { focusElement } from 'platform/utilities/ui/focus';
import CalendarWidget from 'platform/shared/calendar/CalendarWidget';
import Wrapper from '../layout/Wrapper';
import {
  setSelectedDate,
  selectSelectedDate,
  selectUuid,
} from '../redux/slices/formSlice';
import { useGetAppointmentAvailabilityQuery } from '../redux/api/vassApi';

import { mapAppointmentAvailabilityToSlots } from '../utils/slots';
import {
  getTimezoneDescByTimeZoneString,
  getBrowserTimezone,
} from '../utils/timezone';

const DateTimeSelection = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const uuid = useSelector(selectUuid);
  const navigate = useNavigate();
  const {
    data: appointmentAvailability,
    isLoading: loading,
  } = useGetAppointmentAvailabilityQuery(uuid);

  const timezone = getBrowserTimezone();

  const slots = mapAppointmentAvailabilityToSlots(appointmentAvailability);

  // Add a counter state to trigger focusing
  const [focusTrigger, setFocusTrigger] = useState(0);

  // State for managing errors
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Check if a date/time has been selected
  const showValidationError = hasAttemptedSubmit && !selectedDate;

  // This is for loading not sure if we will need it
  const disabledMessage = null;

  const errorMessage = showValidationError
    ? 'Please select a preferred date and time for your appointment.'
    : '';
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
    setHasAttemptedSubmit(false);
  };

  const handleContinue = () => {
    if (!selectedDate) {
      // Set error state if no date/time is selected
      setHasAttemptedSubmit(true);
      // Increment the focus trigger to force re-focusing the validation message
      setFocusTrigger(prev => prev + 1);
      return;
    }
    // Save date selection and proceed to next page if validation passes
    navigate('/topic-selection');
  };

  // Effect to focus on validation message whenever error state changes
  useEffect(
    () => {
      if (showValidationError) {
        // Focus on the error message when validation error is shown
        setTimeout(() => {
          focusElement('.vaos-calendar__validation-msg');
        }, 100);
      }
    },
    [showValidationError, focusTrigger],
  );

  return (
    <Wrapper
      pageTitle="When do you want to schedule your appointment?"
      classNames="vads-u-margin-top--4"
      testID="date-time-selection"
      required
      loading={loading}
      loadingMessage="Loading appointment availability. This may take up to 30 seconds. Please don’t refresh the page."
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
        requiredMessage={errorMessage}
        startMonth={new Date()}
        showValidation={showValidationError}
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
