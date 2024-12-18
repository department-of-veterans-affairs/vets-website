import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import CalendarWidget from '../../components/calendar/CalendarWidget';
import { setSelectedSlot } from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { routeToNextReferralPage, routeToPreviousReferralPage } from '../flow';
import { selectCurrentPage, getSelectedSlot } from '../redux/selectors';
import {
  getAddressString,
  getSlotByDate,
  getSlotById,
  hasConflict,
} from '../utils/provider';
import {
  getTimezoneDescByFacilityId,
  getTimezoneByFacilityId,
} from '../../utils/timezone';
import { getReferralSlotKey } from '../utils/referrals';

export const DateAndTimeContent = props => {
  const { currentReferral, provider, appointmentsByMonth } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const selectedSlot = useSelector(state => getSelectedSlot(state));
  const currentPage = useSelector(selectCurrentPage);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.ReferringFacilityInfo.FacilityCode,
  );
  const selectedSlotKey = getReferralSlotKey(currentReferral.UUID);
  const latestAvailableSlot = new Date(
    Math.max.apply(
      null,
      provider.slots.map(slot => {
        return new Date(slot.start);
      }),
    ),
  );
  useEffect(
    () => {
      if (selectedSlot) {
        setSelectedDate(getSlotById(provider.slots, selectedSlot).start);
      }
    },
    [provider.slots, selectedSlot],
  );
  useEffect(
    () => {
      const savedSelectedSlot = sessionStorage.getItem(selectedSlotKey);
      const savedSlot = getSlotById(provider.slots, savedSelectedSlot);
      if (!savedSlot) {
        return;
      }
      dispatch(setSelectedSlot(savedSlot.id));
    },
    [dispatch, selectedSlotKey, provider.slots],
  );
  const onChange = useCallback(
    value => {
      const newSlot = getSlotByDate(provider.slots, value[0]);
      if (newSlot) {
        setError('');
        dispatch(setSelectedSlot(newSlot.id));
        setSelectedDate(newSlot.start);
        sessionStorage.setItem(selectedSlotKey, newSlot.id);
      }
    },
    [dispatch, provider.slots, selectedSlotKey],
  );
  const onBack = () => {
    routeToPreviousReferralPage(history, currentPage, currentReferral.UUID);
  };
  const onSubmit = () => {
    if (error) {
      return;
    }
    if (!selectedSlot) {
      setError(
        'Please choose your preferred date and time for your appointment',
      );
      return;
    }
    if (
      appointmentsByMonth &&
      hasConflict(selectedDate, appointmentsByMonth, facilityTimeZone)
    ) {
      setError(
        'You already have an appointment at this time. Please select another day or time.',
      );
      return;
    }
    routeToNextReferralPage(history, currentPage, currentReferral.UUID);
  };

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
              href={`https://maps.google.com?addr=Current+Location&daddr=${getAddressString(
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
