import React, { useState } from 'react';
import { startOfMonth, format } from 'date-fns';
import CalendarWidget from '../components/calendar/CalendarWidget';
import FormLayout from '../new-appointment/components/FormLayout';
// import { onCalendarChange } from "../new-appointment/redux/actions";
// import { useDispatch } from 'react-redux';
import FormButtons from '../components/FormButtons';
import { referral } from './temp-data/referral';

export const ChooseDateAndTime = () => {
  // const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState(['2024-07-02T11:00:00']);
  const startMonth = startOfMonth(referral.preferredDate).toDateString();
  const [submitted, setSubmitted] = useState(false);
  const pageTitle = 'Choose a date and time';
  const latestAvailableSlot = new Date(
    Math.max.apply(
      null,
      referral.slots.map(slot => {
        return new Date(slot.start);
      }),
    ),
  );
  return (
    <FormLayout pageTitle={pageTitle}>
      <div>
        <h1>{pageTitle}</h1>
        <h2 className="vads-u-font-size--h3">{referral.providerName}</h2>
        <p>{referral.typeOfCare}</p>
        <h3 className="vads-u-font-size--h3">{referral.orgName}</h3>
        <address>
          <p className="vads-u-margin--0">
            {referral.orgAddress.street1} <br />
            {referral.orgAddress.street2 && (
              <>
                {referral.orgAddress.street2}
                <br />
              </>
            )}
            {referral.orgAddress.street3 && (
              <>
                {referral.orgAddress.street3}
                <br />
              </>
            )}
            {referral.orgAddress.city}, {referral.orgAddress.state},{' '}
            {referral.orgAddress.zip}
          </p>
        </address>
        <p>Phone: {referral.orgPhone}</p>
        <p>
          {referral.driveTime} ({referral.driveDistance})
        </p>
        <p>
          Please select an available date and time from the calendar below.
          Appointment times are displayed in {referral.timezone} timezone.
        </p>
      </div>
      <div>
        <CalendarWidget
          maxSelections={1}
          availableSlots={referral.slots}
          value={selectedDates}
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
          onChange={setSelectedDates}
          onNextMonth={null}
          onPreviousMonth={null}
          minDate={format(new Date(), 'yyyy-mm-dd')}
          maxDate={format(latestAvailableSlot, 'yyyy-mm-dd')}
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
