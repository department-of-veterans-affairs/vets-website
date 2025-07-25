import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CalendarWidget from '../../components/calendar/CalendarWidget';
import { setSelectedSlot } from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { routeToNextReferralPage, routeToPreviousReferralPage } from '../flow';
import { selectCurrentPage, getSelectedSlot } from '../redux/selectors';
import { getSlotByDate } from '../utils/provider';
import { getDriveTimeString } from '../../utils/appointment';
import {
  getTimezoneDescByFacilityId,
  getTimezoneByFacilityId,
} from '../../utils/timezone';
import { getReferralSlotKey } from '../utils/referrals';
import { titleCase } from '../../utils/formatters';
import ProviderAddress from './ProviderAddress';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

export const DateAndTimeContent = props => {
  const { currentReferral, draftAppointmentInfo, appointmentsByMonth } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  // Add a counter state to trigger focusing
  const [focusTrigger, setFocusTrigger] = useState(0);

  const selectedSlot = useSelector(state => getSelectedSlot(state));
  const currentPage = useSelector(selectCurrentPage);
  const [error, setError] = useState('');
  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.referringFacility.code,
  );
  const selectedSlotKey = getReferralSlotKey(currentReferral.uuid);
  const latestAvailableSlot = new Date(
    Math.max.apply(
      null,
      draftAppointmentInfo.attributes.slots.map(slot => {
        return new Date(slot.start);
      }),
    ),
  );
  const onChange = useCallback(
    (value, hasConflict = false) => {
      if (hasConflict) {
        setError(
          'You already have an appointment at this time. Please select another day or time.',
        );
      }
      const newSlot = getSlotByDate(
        draftAppointmentInfo.attributes.slots,
        value[0],
      );
      if (!hasConflict && newSlot) {
        setError('');
        sessionStorage.setItem(selectedSlotKey, newSlot.start);
      }
      if (newSlot) {
        dispatch(setSelectedSlot(newSlot.start));
      }
    },
    [dispatch, draftAppointmentInfo.attributes.slots, selectedSlotKey],
  );

  useEffect(
    () => {
      const savedSelectedSlot = sessionStorage.getItem(selectedSlotKey);
      const savedSlot = getSlotByDate(
        draftAppointmentInfo.attributes.slots,
        savedSelectedSlot,
      );
      if (!savedSlot) {
        return;
      }
      onChange(savedSlot.start);
    },
    [
      dispatch,
      selectedSlotKey,
      draftAppointmentInfo.attributes.slots,
      appointmentsByMonth,
      onChange,
    ],
  );
  const onBack = () => {
    routeToPreviousReferralPage(history, currentPage, currentReferral.uuid);
  };
  const onSubmit = () => {
    if (error) {
      // Increment the focus trigger to force re-focusing the validation message
      setFocusTrigger(prev => prev + 1);
      return;
    }
    if (!selectedSlot) {
      setError(
        'Please choose your preferred date and time for your appointment',
      );
      return;
    }
    routeToNextReferralPage(history, currentPage, currentReferral.uuid);
  };

  // Effect to focus on validation message whenever error state changes
  useEffect(
    () => {
      scrollAndFocus('.vaos-input-error-message');
    },
    [error, focusTrigger],
  );

  const noSlotsAvailable = !draftAppointmentInfo.attributes.slots.length;

  // Get the drive time string
  const driveTimeInSeconds =
    draftAppointmentInfo?.attributes?.drivetime?.destination
      ?.driveTimeInSecondsWithoutTraffic;
  const driveTimeDistance =
    draftAppointmentInfo?.attributes?.drivetime?.destination?.distanceInMiles;
  const driveTimeString = getDriveTimeString(
    driveTimeInSeconds,
    driveTimeDistance,
  );

  const disabledMessage = (
    <va-loading-indicator
      data-testid="loadingIndicator"
      set-focus
      message="Finding appointment availability..."
    />
  );

  return (
    <>
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin--0">
          <span data-dd-privacy="mask">{currentReferral.provider.name}</span>
        </p>
        <p className="vads-u-margin-top--0">
          <span data-dd-privacy="mask">
            {titleCase(currentReferral.categoryOfCare)}
          </span>
        </p>
        <p className="vads-u-margin--0 vads-u-font-weight--bold">
          <span data-dd-privacy="mask">
            {draftAppointmentInfo.attributes.provider.providerOrganization.name}
          </span>
        </p>
        <ProviderAddress
          address={draftAppointmentInfo.attributes.provider.location.address}
          showDirections
          directionsName={
            draftAppointmentInfo.attributes.provider.providerOrganization.name
          }
          phone={currentReferral.provider.phone}
        />
        {driveTimeString && <p>{driveTimeString}</p>}
        <p>
          <strong>Note:</strong> You or your VA facility chose this provider for
          this referral. If you want a different provider, you’ll need to
          request a new referral.
        </p>
        <h2>Choose a date and time</h2>
        {!noSlotsAvailable && (
          <p>
            Select an available date and time from the calendar below.
            Appointment times are displayed in{' '}
            {`${getTimezoneDescByFacilityId(
              currentReferral.referringFacility.code,
            )}`}
            .
          </p>
        )}
      </div>
      {noSlotsAvailable && (
        <va-alert
          status="warning"
          data-testid="no-slots-alert"
          class="vads-u-margin-top--3"
        >
          <h2 slot="headline">
            We’re sorry. We couldn’t find any open time slots.
          </h2>
          <p>Please call this provider to schedule an appointment</p>
          <va-telephone contact={currentReferral.provider.telephone} />
        </va-alert>
      )}
      {!noSlotsAvailable && (
        <>
          <div data-testid="cal-widget">
            <CalendarWidget
              maxSelections={1}
              availableSlots={draftAppointmentInfo.attributes.slots}
              value={[selectedSlot || '']}
              id="dateTime"
              timezone={facilityTimeZone}
              additionalOptions={{
                required: true,
              }}
              // disabled={loadingSlots}
              disabledMessage={disabledMessage}
              onChange={onChange}
              onNextMonth={null}
              onPreviousMonth={null}
              minDate={new Date()}
              maxDate={latestAvailableSlot}
              required
              requiredMessage={error}
              startMonth={new Date()}
              showValidation={error.length > 0}
              showWeekends
              overrideMaxDays
              upcomingAppointments={appointmentsByMonth}
            />
          </div>
          <FormButtons
            onBack={() => onBack()}
            onSubmit={() => onSubmit()}
            loadingText="Page change in progress"
          />
        </>
      )}
    </>
  );
};

DateAndTimeContent.propTypes = {
  currentReferral: PropTypes.object.isRequired,
  draftAppointmentInfo: PropTypes.object.isRequired,
  appointmentsByMonth: PropTypes.object,
};

export default DateAndTimeContent;
