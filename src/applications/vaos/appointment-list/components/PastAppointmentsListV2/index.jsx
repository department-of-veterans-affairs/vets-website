import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import { getPastAppointmentListInfo } from '../../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
} from '../../../utils/constants';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import AppointmentListItem from '../AppointmentsPageV2/AppointmentListItem';
import NoAppointments from '../NoAppointments';
import moment from 'moment';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import InfoAlert from '../../../components/InfoAlert';
import {
  fetchPastAppointments,
  startNewAppointmentFlow,
} from '../../redux/actions';

export function getPastAppointmentDateRangeOptions(today = moment()) {
  const startOfToday = today.clone().startOf('day');

  // Past 3 months
  const options = [
    {
      value: 0,
      label: 'Past 3 months',
      startDate: startOfToday
        .clone()
        .subtract(3, 'months')
        .format(),
      endDate: today.format(),
    },
  ];

  // 3 month ranges going back ~1 year
  let index = 1;
  let monthsToSubtract = 3;

  while (index < 4) {
    const start = startOfToday
      .clone()
      .subtract(index === 1 ? 5 : monthsToSubtract + 2, 'months')
      .startOf('month');
    const end = startOfToday
      .clone()
      .subtract(index === 1 ? 3 : monthsToSubtract, 'months')
      .endOf('month');

    options.push({
      value: index,
      label: `${start.format('MMM YYYY')} – ${end.format('MMM YYYY')}`,
      startDate: start.format(),
      endDate: end.format(),
    });

    monthsToSubtract += 3;
    index += 1;
  }

  // All of current year
  options.push({
    value: 4,
    label: `All of ${startOfToday.format('YYYY')}`,
    startDate: startOfToday
      .clone()
      .startOf('year')
      .format(),
    endDate: startOfToday.format(),
  });

  // All of last year
  const lastYear = startOfToday.clone().subtract(1, 'years');

  options.push({
    value: 5,
    label: `All of ${lastYear.format('YYYY')}`,
    startDate: lastYear.startOf('year').format(),
    endDate: lastYear
      .clone()
      .endOf('year')
      .format(),
  });

  return options;
}

export default function PastAppointmentsListNew() {
  const dispatch = useDispatch();
  const [isInitialMount, setInitialMount] = useState(true);
  const dateRangeOptions = getPastAppointmentDateRangeOptions();
  const {
    showScheduleButton,
    pastAppointmentsByMonth,
    pastStatus,
    facilityData,
    pastSelectedIndex,
    hasTypeChanged,
  } = useSelector(state => getPastAppointmentListInfo(state), shallowEqual);

  useEffect(() => {
    if (pastStatus === FETCH_STATUS.notStarted) {
      const selectedDateRange = dateRangeOptions[pastSelectedIndex];
      dispatch(
        fetchPastAppointments(
          selectedDateRange.startDate,
          selectedDateRange.endDate,
          pastSelectedIndex,
        ),
      );
    }
  }, []);
  useEffect(
    () => {
      if (pastStatus === FETCH_STATUS.succeeded && !isInitialMount) {
        scrollAndFocus('h3');
      } else if (hasTypeChanged && pastStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && pastStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [isInitialMount, pastStatus, hasTypeChanged],
  );

  const onDateRangeChange = index => {
    const selectedDateRange = dateRangeOptions[index];

    setInitialMount(false);
    dispatch(
      fetchPastAppointments(
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        index,
      ),
    );
  };
  const dropdown = (
    <PastAppointmentsDateDropdown
      currentRange={pastSelectedIndex}
      onChange={onDateRangeChange}
      options={dateRangeOptions}
    />
  );

  if (
    pastStatus === FETCH_STATUS.loading ||
    pastStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <>
        {dropdown}
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
            set-focus={hasTypeChanged || !isInitialMount}
            message="Loading your past appointments..."
          />
        </div>
      </>
    );
  }

  if (
    pastStatus === FETCH_STATUS.loading ||
    pastStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <>
        {dropdown}
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
            set-focus={hasTypeChanged || !isInitialMount}
            message="Loading your past appointments..."
          />
        </div>
      </>
    );
  }

  if (pastStatus === FETCH_STATUS.failed) {
    return (
      <>
        {dropdown}
        <InfoAlert
          status="error"
          headline="We’re sorry. We’ve run into a problem"
        >
          We’re having trouble getting your past appointments. Please try later.
        </InfoAlert>
      </>
    );
  }

  return (
    <>
      {dropdown}
      <div aria-live="assertive" className="sr-only">
        {(hasTypeChanged || !isInitialMount) &&
          `Showing appointments for ${
            dateRangeOptions[pastSelectedIndex]?.label
          }`}
      </div>
      {pastAppointmentsByMonth?.map((monthBucket, monthIndex) => {
        const monthDate = moment(monthBucket[0].start);
        return (
          <React.Fragment key={monthIndex}>
            <h3
              id={`appointment_list_${monthDate.format('YYYY-MM')}`}
              data-cy="past-appointment-list-header"
            >
              <span className="sr-only">Appointments in </span>
              {monthDate.format('MMMM YYYY')}
            </h3>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              aria-labelledby={`appointment_list_${monthDate.format(
                'YYYY-MM',
              )}`}
              className="vads-u-padding-left--0"
              data-cy="past-appointment-list"
              role="list"
            >
              {monthBucket.map((appt, index) => {
                const facilityId = getVAAppointmentLocationId(appt);

                if (
                  appt.vaos.appointmentType ===
                    APPOINTMENT_TYPES.vaAppointment ||
                  appt.vaos.appointmentType === APPOINTMENT_TYPES.ccAppointment
                ) {
                  return (
                    <AppointmentListItem
                      key={index}
                      appointment={appt}
                      facility={facilityData[facilityId]}
                    />
                  );
                }
                return null;
              })}
            </ul>
          </React.Fragment>
        );
      })}
      {!pastAppointmentsByMonth?.length && (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3">
          <NoAppointments
            description="past appointments"
            showScheduleButton={showScheduleButton}
            startNewAppointmentFlow={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              dispatch(startNewAppointmentFlow());
            }}
          />
        </div>
      )}
    </>
  );
}
