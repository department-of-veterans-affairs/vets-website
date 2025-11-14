import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { focusElement } from 'platform/utilities/ui/focus';
import Wrapper from '../layout/Wrapper';
// TODO: make this component a shared component
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import CalendarWidget from '../../vaos/components/calendar/CalendarWidget';

const DateTimeSelection = () => {
  const navigate = useNavigate();

  // Add a counter state to trigger focusing
  const [focusTrigger, setFocusTrigger] = useState(0);

  // State for managing selected dates and errors
  const [selectedDates, setSelectedDates] = useState([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Check if a date/time has been selected
  const hasSelectedDateTime = selectedDates.length > 0 && selectedDates[0];
  const showValidationError = hasAttemptedSubmit && !hasSelectedDateTime;

  // Placeholder values for the calendar widget
  const draftAppointmentInfo = {
    attributes: {
      slots: [
        {
          start: '2025-11-15T09:00:00.000Z',
          end: '2025-11-15T09:30:00.000Z',
        },
        {
          start: '2025-11-15T10:00:00.000Z',
          end: '2025-11-15T10:30:00.000Z',
        },
        {
          start: '2025-11-16T14:00:00.000Z',
          end: '2025-11-16T14:30:00.000Z',
        },
      ],
    },
  };

  // This is for loading not sure if we will need it
  const disabledMessage = null;

  const errorMessage = showValidationError
    ? 'Please select a preferred date and time for your appointment.'
    : '';
  const latestAvailableSlot = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now

  const onChange = selectedDateTimes => {
    // Update selected dates and clear any previous error state
    setSelectedDates(selectedDateTimes || []);
    if (
      hasAttemptedSubmit &&
      selectedDateTimes &&
      selectedDateTimes.length > 0
    ) {
      setHasAttemptedSubmit(false);
    }
  };

  const handleContinue = () => {
    if (!hasSelectedDateTime) {
      // Set error state if no date/time is selected
      setHasAttemptedSubmit(true);
      // Increment the focus trigger to force re-focusing the validation message
      setFocusTrigger(prev => prev + 1);
      return;
    }
    // Proceed to next page if validation passes
    navigate('/review');
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
    <Wrapper pageTitle="What date and time do you want for this appointment?">
      <div data-testid="content">
        <p>
          Select an available date and time from the calendar below. Appointment
          times are displayed in [Time Zone] [(TZ)].
        </p>
        <p>
          <strong>Note:</strong> Available dates are shown for the next 2 weeks,
          and weekends are unavailable.
        </p>
      </div>

      <CalendarWidget
        maxSelections={1}
        availableSlots={draftAppointmentInfo.attributes.slots}
        value={selectedDates}
        id="dateTime"
        timezone="America/New_York"
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
      />
    </Wrapper>
  );
};

export default DateTimeSelection;
