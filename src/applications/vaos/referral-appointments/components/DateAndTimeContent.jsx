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
import { getSlotByDate, getSlotById, hasConflict } from '../utils/provider';
import {
  getTimezoneDescByFacilityId,
  getTimezoneByFacilityId,
} from '../../utils/timezone';
import { getReferralSlotKey } from '../utils/referrals';
import ProviderAddress from './ProviderAddress';

export const DateAndTimeContent = props => {
  const { currentReferral, draftAppointmentInfo, appointmentsByMonth } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const selectedSlot = useSelector(state => getSelectedSlot(state));
  const currentPage = useSelector(selectCurrentPage);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const facilityTimeZone = getTimezoneByFacilityId(
    currentReferral.referringFacilityInfo.facilityCode,
  );
  const selectedSlotKey = getReferralSlotKey(currentReferral.uuid);
  const latestAvailableSlot = new Date(
    Math.max.apply(
      null,
      draftAppointmentInfo.slots.slots.map(slot => {
        return new Date(slot.start);
      }),
    ),
  );
  useEffect(() => {
    if (selectedSlot) {
      setSelectedDate(
        getSlotById(draftAppointmentInfo.slots.slots, selectedSlot).start,
      );
    }
  }, [draftAppointmentInfo.slots.slots, selectedSlot]);
  useEffect(() => {
    const savedSelectedSlot = sessionStorage.getItem(selectedSlotKey);
    const savedSlot = getSlotById(
      draftAppointmentInfo.slots.slots,
      savedSelectedSlot,
    );
    if (!savedSlot) {
      return;
    }
    dispatch(setSelectedSlot(savedSlot.id));
  }, [dispatch, selectedSlotKey, draftAppointmentInfo.slots]);
  const onChange = useCallback(
    value => {
      const newSlot = getSlotByDate(draftAppointmentInfo.slots.slots, value[0]);
      if (newSlot) {
        setError('');
        dispatch(setSelectedSlot(newSlot.id));
        setSelectedDate(newSlot.start);
        sessionStorage.setItem(selectedSlotKey, newSlot.id);
      }
    },
    [dispatch, draftAppointmentInfo.slots.slots, selectedSlotKey],
  );
  const onBack = () => {
    routeToPreviousReferralPage(history, currentPage, currentReferral.uuid);
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
    routeToNextReferralPage(history, currentPage, currentReferral.uuid);
  };

  const noSlotsAvailable = !draftAppointmentInfo.slots.slots.length;

  const driveTimeMinutes = Math.floor(
    draftAppointmentInfo.drivetime.destination
      .driveTimeInSecondsWithoutTraffic / 60,
  );
  const driveTimeDistance =
    draftAppointmentInfo.drivetime.destination.distanceInMiles;

  const driveTimeString =
    driveTimeMinutes && driveTimeDistance
      ? `${driveTimeMinutes}-minute drive (${driveTimeDistance} miles)`
      : null;

  return (
    <>
      <div>
        <p>
          You or your referring VA facility selected to schedule an appointment
          online with this provider:
        </p>
        <p className="vads-u-font-weight--bold vads-u-margin--0">
          {draftAppointmentInfo.provider.name}
        </p>
        <p className="vads-u-margin-top--0">{currentReferral.categoryOfCare}</p>
        <p className="vads-u-margin--0 vads-u-font-weight--bold">
          {draftAppointmentInfo.provider.providerOrganization.name}
        </p>
        <ProviderAddress
          address={currentReferral.referringFacilityInfo.address}
          showDirections
          directionsName={currentReferral.referringFacilityInfo.facilityName}
          phone={currentReferral.referringFacilityInfo.phone}
        />
        {driveTimeString && <p>{driveTimeString}</p>}
        <h2>Choose a date and time</h2>
        {!noSlotsAvailable && (
          <p>
            Select an available date and time from the calendar below.
            Appointment times are displayed in{' '}
            {`${getTimezoneDescByFacilityId(
              currentReferral.referringFacilityInfo.facilityCode,
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
          <va-telephone contact={currentReferral.referringFacilityInfo.phone} />
        </va-alert>
      )}
      {!noSlotsAvailable && (
        <>
          <div data-testid="cal-widget">
            <CalendarWidget
              maxSelections={1}
              availableSlots={draftAppointmentInfo.slots.slots}
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
      )}
    </>
  );
};

DateAndTimeContent.propTypes = {
  appointmentsByMonth: PropTypes.object.isRequired,
  currentReferral: PropTypes.object.isRequired,
  draftAppointmentInfo: PropTypes.object.isRequired,
};

export default DateAndTimeContent;
