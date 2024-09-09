import React, { useState } from 'react';
import moment from 'moment';
import CalendarWidget from '../components/calendar/CalendarWidget';
import FormLayout from '../new-appointment/components/FormLayout';
// import { onCalendarChange } from "../new-appointment/redux/actions";
// import { useDispatch } from 'react-redux';
import FormButtons from '../components/FormButtons';

export const ChooseDateAndTime = () => {
  // const dispatch = useDispatch();
  const availableSlots = [
    {
      end: '2024-07-02T17:00:00Z',
      id: '32303',
      start: '2024-07-01T10:00:00',
    },
    {
      end: '2024-07-02T18:00:00Z',
      id: '23555',
      start: '2024-07-02T11:00:00',
    },
  ];
  const selectedDates = ['2024-07-02T11:00:00'];
  const timezone = 'America/Denver';
  const preferredDate = '2024-07-02';
  const startMonth = preferredDate
    ? moment(preferredDate).format('YYYY-MM')
    : null;
  const [submitted, setSubmitted] = useState(false);
  return (
    <FormLayout>
      <div>
        <h1>Choose a date and time</h1>
        <p>Physical Therapy</p>
        <p>GLA Medical Canter - Southwest</p>

        <h1>Physical Therapy of GLA</h1>
        <p>111 Medical Lane, Suite 300</p>
        <p>Los Angeles, CA 12345</p>
        <p>Phone: 555-555-5555</p>

        <p>7 minute drive (2 miles)</p>
      </div>
      <div>
        <CalendarWidget
          maxSelections={1}
          availableSlots={availableSlots}
          value={selectedDates}
          id="dateTime"
          timezone={timezone}
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
          onChange={null}
          onNextMonth={null}
          onPreviousMonth={null}
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
      </div>
      <FormButtons
        onBack={() => {}}
        onSubmit={() => setSubmitted(true)}
        // pageChangeInProgress={pageChangeInProgress}
        loadingText="Page change in progress"
      />
    </FormLayout>
  );
};

export default ChooseDateAndTime;
