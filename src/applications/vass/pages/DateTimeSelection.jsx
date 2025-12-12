import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import { focusElement } from 'platform/utilities/ui/focus';
import Wrapper from '../layout/Wrapper';
import { usePersistentSelections } from '../hooks/usePersistentSelections';
import { setSelectedDate, selectSelectedDate } from '../redux/slices/formSlice';
import { useGetAppointmentAvailabilityQuery } from '../redux/api/vassApi';

// TODO: remove this once we have a real UUID
const UUID = 'af40d0e7-df29-4df3-8b5e-03eac2e760fa';

// TODO: make this component a shared component
import CalendarWidget from '../components/calendar/CalendarWidget';

const DateTimeSelection = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const navigate = useNavigate();
  const { saveDateSelection, getSaved } = usePersistentSelections(UUID);

  // Fetch appointment availability using RTK Query
  const {
    data: availabilityData,
    isLoading,
    isError,
  } = useGetAppointmentAvailabilityQuery();

  const saveDate = useCallback(
    date => {
      saveDateSelection(date);
      dispatch(setSelectedDate(date));
    },
    [saveDateSelection, dispatch],
  );

  const loadSavedDate = useCallback(
    () => {
      const savedDate = getSaved()?.selectedSlotTime;
      if (savedDate) {
        dispatch(setSelectedDate(savedDate));
      }
    },
    [getSaved, dispatch],
  );

  // Add a counter state to trigger focusing
  const [focusTrigger, setFocusTrigger] = useState(0);

  // State for managing errors
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Check if a date/time has been selected
  const showValidationError = hasAttemptedSubmit && !selectedDate;

  // Convert API response format to calendar widget format
  const draftAppointmentInfo = useMemo(
    () => {
      const availableSlots = availabilityData?.data?.availableTimeSlots || [];
      return {
        attributes: {
          slots: availableSlots.map(slot => ({
            start: slot.dtStartUtc,
            end: slot.dtEndUtc,
          })),
        },
      };
    },
    [availabilityData],
  );

  // Disable calendar if loading or error
  let disabledMessage = null;
  if (isLoading) {
    disabledMessage = 'Loading available appointments...';
  } else if (isError) {
    disabledMessage =
      'Unable to load available appointments. Please try again later.';
  }

  const errorMessage = showValidationError
    ? 'Please select a preferred date and time for your appointment.'
    : '';

  // Calculate latest available slot if slots exist
  const latestAvailableSlot =
    draftAppointmentInfo.attributes.slots.length > 0
      ? new Date(
          draftAppointmentInfo.attributes.slots[
            draftAppointmentInfo.attributes.slots.length - 1
          ].end,
        )
      : new Date();

  const onChange = selectedDateTimes => {
    // Update selected dates and clear any previous error state
    saveDate(selectedDateTimes[0]);
    setHasAttemptedSubmit(false);
  };

  useEffect(
    () => {
      loadSavedDate();
    },
    [loadSavedDate],
  );

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
      pageTitle="What date and time do you want for this appointment?"
      classNames="vads-u-margin-top--4"
      required
    >
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

      {isLoading && (
        <va-loading-indicator
          message="Loading available appointments..."
          set-focus
        />
      )}

      {isError && (
        <va-alert status="error" visible>
          <h2 slot="headline">We can’t load available appointments</h2>
          <p>
            We’re sorry. Something went wrong on our end. Please try again
            later.
          </p>
        </va-alert>
      )}

      {!isLoading &&
        !isError && (
          <>
            <CalendarWidget
              maxSelections={1}
              availableSlots={draftAppointmentInfo.attributes.slots}
              value={selectedDate ? [selectedDate] : []}
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
              text={null}
            />
          </>
        )}
    </Wrapper>
  );
};

export default DateTimeSelection;
