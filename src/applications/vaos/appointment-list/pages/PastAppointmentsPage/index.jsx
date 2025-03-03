import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import classNames from 'classnames';
import moment from 'moment';
import { format, subMonths } from 'date-fns';
import { useHistory } from 'react-router-dom';
import InfoAlert from '../../../components/InfoAlert';
import {
  selectFeatureBreadcrumbUrlUpdate,
  selectFeaturePastApptDateRange,
} from '../../../redux/selectors';
import { groupAppointmentByDay } from '../../../services/appointment';
import { FETCH_STATUS, GA_PREFIX } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import BackendAppointmentServiceAlert from '../../components/BackendAppointmentServiceAlert';
import NoAppointments from '../../components/NoAppointments';
import {
  fetchPastAppointments,
  startNewAppointmentFlow,
} from '../../redux/actions';
import { getPastAppointmentListInfo } from '../../redux/selectors';
import UpcomingAppointmentLayout from '../AppointmentsPage/UpcomingAppointmentLayout';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';

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
        .format('YYYY-MM-DD'),
      endDate: today
        .clone()
        .startOf('hour')
        .format('YYYY-MM-DD'),
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
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
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
      .format('YYYY-MM-DD'),
    endDate: startOfToday.format('YYYY-MM-DD'),
  });

  // All of last year
  const lastYear = startOfToday.clone().subtract(1, 'years');

  options.push({
    value: 5,
    label: `All of ${lastYear.format('YYYY')}`,
    startDate: lastYear.startOf('year').format('YYYY-MM-DD'),
    endDate: lastYear
      .clone()
      .endOf('year')
      .format('YYYY-MM-DD'),
  });

  return options;
}

export function getMaximumPastAppointmentDateRange() {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  return [
    {
      value: 0,
      label: 'Past 3 months',
      startDate: format(subMonths(now, 3), 'yyyy-MM-dd'),
      endDate: today,
    },
    {
      value: 1,
      label: 'Past 6 months',
      startDate: format(subMonths(now, 6), 'yyyy-MM-dd'),
      endDate: today,
    },
    {
      value: 2,
      label: 'Past 12 months',
      startDate: format(subMonths(now, 12), 'yyyy-MM-dd'),
      endDate: today,
    },
    {
      value: 3,
      label: 'Past 24 months',
      startDate: format(subMonths(now, 24), 'yyyy-MM-dd'),
      endDate: today,
    },
  ];
}

export default function PastAppointmentsPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isInitialMount, setInitialMount] = useState(true);
  const featurePastApptDateRange = useSelector(state =>
    selectFeaturePastApptDateRange(state),
  );

  const dateRangeOptions = featurePastApptDateRange
    ? getMaximumPastAppointmentDateRange()
    : getPastAppointmentDateRangeOptions();
  const {
    showScheduleButton,
    pastAppointmentsByMonth,
    pastStatus,
    pastSelectedIndex,
    hasTypeChanged,
  } = useSelector(state => getPastAppointmentListInfo(state), shallowEqual);

  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

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

  const keys = Object.keys(pastAppointmentsByMonth);

  return (
    <>
      <BackendAppointmentServiceAlert />
      {dropdown}
      <div aria-live="assertive" className="sr-only">
        {`Showing appointments for ${
          dateRangeOptions[pastSelectedIndex]?.label
        }`}
      </div>
      <div className="vaos-print-only vads-u-margin-top--neg2 vads-u-margin-bottom--2">
        {dateRangeOptions[pastSelectedIndex]?.label}
      </div>

      {keys.map(key => {
        const monthDate = moment(key, 'YYYY-MM');

        let hashTable = pastAppointmentsByMonth;
        hashTable = groupAppointmentByDay(hashTable[key]);

        return (
          <React.Fragment key={key}>
            <h2
              data-cy="past-appointment-list-header"
              className="vads-u-margin-top--0 vads-u-font-size--h3"
            >
              {monthDate.format('MMMM YYYY')}
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
              data-testid={`appointment-list-${monthDate.format('YYYY-MM')}`}
              role="list"
            >
              {UpcomingAppointmentLayout({
                featureBreadcrumbUrlUpdate,
                hashTable,
                history,
              })}
            </ul>
          </React.Fragment>
        );
      })}

      {!keys.length && (
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
            level={2}
          />
        </div>
      )}
    </>
  );
}
