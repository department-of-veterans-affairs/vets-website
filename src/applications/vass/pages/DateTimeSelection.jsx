import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui/focus';
import { generateSlots } from '../utils/mock-helpers';
import Wrapper from '../layout/Wrapper';
import { usePersistentSelections } from '../hooks/usePersistentSelections';
import { setSelectedDate, selectSelectedDate } from '../redux/slices/formSlice';

// TODO: remove this once we have a real UUID
const UUID = 'af40d0e7-df29-4df3-8b5e-03eac2e760fa';

// TODO: make this component a shared component
import CalendarWidget from '../components/calendar/CalendarWidget';

const DateTimeSelection = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const navigate = useNavigate();
  const { saveDateSelection, getSaved } = usePersistentSelections(UUID);

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

  // Placeholder values for the calendar widget two weeks from now
  const draftAppointmentInfo = {
    attributes: {
      slots: generateSlots(),
    },
  };

  // This is for loading not sure if we will need it
  const disabledMessage = null;

  const errorMessage = showValidationError
    ? 'Please select a preferred date and time for your appointment.'
    : '';
  const latestAvailableSlot = new Date(
    draftAppointmentInfo.attributes.slots[
      draftAppointmentInfo.attributes.slots.length - 1
    ].end,
  );

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

  const handleBack = () => {
    // TODO: manage state?
    navigate(-1);
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
      <VaButtonPair
        data-testid="button-pair"
        continue
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
        class="vads-u-margin-top--4"
      />
    </Wrapper>
  );
};

export default DateTimeSelection;
