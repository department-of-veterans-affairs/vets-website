import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames';
import { addDays, format, parseISO, subMonths } from 'date-fns';
import { useHistory } from 'react-router-dom';
import InfoAlert from '../../../components/InfoAlert';
import { groupAppointmentByDay } from '../../../services/appointment';
import { FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import BackendAppointmentServiceAlert from '../../components/BackendAppointmentServiceAlert';
import { fetchPastAppointments } from '../../redux/actions';
import {
  getPastAppointmentListInfo,
  selectPastAppointments,
} from '../../redux/selectors';
import UpcomingAppointmentLayout from '../AppointmentsPage/UpcomingAppointmentLayout';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';

export function getMaximumPastAppointmentDateRange() {
  const now = new Date();
  const tomorrow = format(addDays(now, 1), 'yyyy-MM-dd');

  const dateRanges = [3, 6, 12, 24];
  return dateRanges.map((range, index) => {
    const start = subMonths(now, range);
    return {
      value: index,
      label: `Past ${range} months`,
      startDateRaw: start,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: tomorrow,
    };
  });
}

export default function PastAppointmentsPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isInitialMount, setInitialMount] = useState(true);

  const dateRangeOptions = getMaximumPastAppointmentDateRange();
  const {
    pastAppointmentsByMonth,
    pastStatus,
    pastSelectedIndex,
  } = useSelector(state => getPastAppointmentListInfo(state), shallowEqual);
  const pastAppointments = useSelector(state => selectPastAppointments(state));

  useEffect(() => {
    if (pastStatus === FETCH_STATUS.notStarted) {
      const selectedDateRange = dateRangeOptions[pastSelectedIndex];
      dispatch(
        fetchPastAppointments(
          parseISO(selectedDateRange.startDate),
          parseISO(selectedDateRange.endDate),
          pastSelectedIndex,
        ),
      );
    }
  }, []);
  useEffect(
    () => {
      if (pastStatus === FETCH_STATUS.succeeded && !isInitialMount) {
        scrollAndFocus('#appointment-count');
      } else if (pastStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [isInitialMount, pastStatus],
  );

  const onDateRangeChange = index => {
    const selectedDateRange = dateRangeOptions[index];

    setInitialMount(false);
    dispatch(
      fetchPastAppointments(
        parseISO(selectedDateRange.startDate),
        parseISO(selectedDateRange.endDate),
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
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
            set-focus={!isInitialMount}
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
          headline="We can’t access your appointments right now"
        >
          We’re sorry. There’s a problem with our system. Refresh this page or
          try again later.
        </InfoAlert>
      </>
    );
  }

  const keys = Object.keys(pastAppointmentsByMonth);

  let noAppointmentHeading = 'We didn’t find any results in this date range';
  let noAppointmentMessage =
    'Try selecting a different date range. If you can’t find your appointment, contact your VA health facility.';
  if (pastSelectedIndex === dateRangeOptions.length - 1) {
    noAppointmentHeading = 'We didn’t find any results';
    noAppointmentMessage =
      'If you can’t find your appointment, contact your VA health facility.';
  }

  return (
    <>
      <BackendAppointmentServiceAlert />
      {dropdown}

      <div
        id="appointment-count"
        className="vads-u-margin-bottom--2 vads-u-font-style--italic"
      >
        Showing {pastAppointments.length} appointments between today and{' '}
        {format(
          dateRangeOptions[pastSelectedIndex].startDateRaw,
          'MMMM d, yyyy',
        )}
      </div>

      {keys.map(key => {
        const monthDate = parseISO(key);

        let hashTable = pastAppointmentsByMonth;
        hashTable = groupAppointmentByDay(hashTable[key]);

        return (
          <React.Fragment key={key}>
            <h2
              data-cy="past-appointment-list-header"
              className="vads-u-margin-top--0 vads-u-font-size--h3"
            >
              {format(monthDate, 'MMMM yyyy')}
            </h2>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              className={classNames(
                'usa-unstyled-list',
                'vads-u-padding-left--0',
                'vads-u-margin-bottom--4',
                'vads-u-border-bottom--1px',
                'vads-u-border-color--gray-medium',
              )}
              data-testid={`appointment-list-${format(monthDate, 'yyyy-MM')}`}
              role="list"
            >
              {UpcomingAppointmentLayout({
                hashTable,
                history,
              })}
            </ul>
          </React.Fragment>
        );
      })}

      {!keys.length && (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--2">
          <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
            {noAppointmentHeading}
          </h2>
          <p>{noAppointmentMessage}</p>
          <a href="/find-locations">Find your VA health facility</a>
        </div>
      )}
    </>
  );
}
