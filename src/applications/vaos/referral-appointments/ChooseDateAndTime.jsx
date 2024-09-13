import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfMonth, format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import CalendarWidget from '../components/calendar/CalendarWidget';
import FormLayout from '../new-appointment/components/FormLayout';
import { onCalendarChange } from '../new-appointment/redux/actions';
import FormButtons from '../components/FormButtons';
import { referral } from './temp-data/referral';
import { getSelectedDate } from '../new-appointment/redux/selectors';

export const ChooseDateAndTime = () => {
  const history = useHistory();
  const selectedDates = useSelector(state => getSelectedDate(state));
  const dispatch = useDispatch();
  const startMonth = format(startOfMonth(referral.preferredDate), 'yyyy-MM');
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
      dispatch(onCalendarChange(value));
    },
    [dispatch],
  );
  const onSubmit = () => {
    setSubmitted(true);
    if (selectedDates) {
      history.push('/confirm-approved');
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
  return (
    <FormLayout pageTitle={pageTitle}>
      <>
        <div>
          <h1>{pageTitle}</h1>
          <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-margin--0">
            {referral.providerName}
          </p>
          <p className="vads-u-margin-top--0">{referral.typeOfCare}</p>
          <p className="vads-u-margin--0 vads-u-font-weight--bold">
            {referral.orgName}
          </p>
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
                  referral.orgAddress,
                )}`}
                aria-label={`directions to ${referral.orgName}`}
                target="_blank"
                rel="noreferrer"
              >
                Directions
              </a>
            </div>
          </address>
          <p>Phone: {referral.orgPhone}</p>
          <p>
            {referral.driveTime} ({referral.driveDistance})
          </p>
          <p>
            Please select an available date and time from the calendar below.
            Appointment times are displayed in {`${tzLong} (${tzShort})`}.
          </p>
        </div>
        <div>
          <CalendarWidget
            maxSelections={1}
            availableSlots={referral.slots}
            value={[selectedDates]}
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
            requiredMessage="Please choose your preferred date and time for your appointment"
            startMonth={startMonth}
            showValidation={submitted && !selectedDates?.length}
            showWeekends
            overrideMaxDays
          />
        </div>
        <FormButtons
          onBack={() => history.push('/choose-community-care-appointment')}
          onSubmit={() => onSubmit()}
          // pageChangeInProgress={pageChangeInProgress}
          loadingText="Page change in progress"
        />
      </>
    </FormLayout>
  );
};

export default ChooseDateAndTime;
