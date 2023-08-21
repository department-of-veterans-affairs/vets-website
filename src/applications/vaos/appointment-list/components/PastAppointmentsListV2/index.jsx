import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import { focusElement } from 'platform/utilities/ui';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { getPastAppointmentListInfo } from '../../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
  SPACE_BAR,
} from '../../../utils/constants';
import {
  getLink,
  getVAAppointmentLocationId,
  groupAppointmentByDay,
} from '../../../services/appointment';
import AppointmentListItem from '../AppointmentsPageV2/AppointmentListItem';
import NoAppointments from '../NoAppointments';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import InfoAlert from '../../../components/InfoAlert';
import {
  fetchPastAppointments,
  startNewAppointmentFlow,
} from '../../redux/actions';
import {
  selectFeatureAppointmentList,
  selectFeatureStatusImprovement,
} from '../../../redux/selectors';
import AppointmentCard from '../AppointmentsPageV2/AppointmentCard';
import UpcomingAppointmentLayout from '../AppointmentsPageV2/UpcomingAppointmentLayout';
import BackendAppointmentServiceAlert from '../BackendAppointmentServiceAlert';

function handleClick({ history, link, idClickable }) {
  return () => {
    if (!window.getSelection().toString()) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

function handleKeyDown({ history, link, idClickable }) {
  return event => {
    if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

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

export default function PastAppointmentsListNew() {
  const history = useHistory();
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
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
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
        if (featureAppointmentList) {
          hashTable = groupAppointmentByDay(hashTable[key]);
        }

        return (
          <React.Fragment key={key}>
            <h3
              id={`appointment_list_${monthDate.format('YYYY-MM')}`}
              data-cy="past-appointment-list-header"
              className="vads-u-margin-top--0"
            >
              <span className="sr-only">Appointments in </span>
              {monthDate.format('MMMM YYYY')}
            </h3>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              aria-labelledby={`appointment_list_${monthDate.format(
                'YYYY-MM',
              )}`}
              className={classNames(
                'usa-unstyled-list',
                'vads-u-padding-left--0',
                'vads-u-margin-bottom--4',
                {
                  'vads-u-border-bottom--1px': featureAppointmentList,
                  'vads-u-border-color--gray-medium': featureAppointmentList,
                },
              )}
              data-cy="past-appointment-list"
              role="list"
            >
              {featureAppointmentList &&
                UpcomingAppointmentLayout({
                  featureStatusImprovement,
                  hashTable,
                  history,
                })}

              {!featureAppointmentList &&
                hashTable[key].map((appt, index) => {
                  const facilityId = getVAAppointmentLocationId(appt);
                  const idClickable = `id-${appt.id.replace('.', '\\.')}`;
                  const link = getLink({
                    featureStatusImprovement,
                    appointment: appt,
                  });

                  if (
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.vaAppointment ||
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.ccAppointment
                  ) {
                    return (
                      <AppointmentListItem
                        key={index}
                        id={appt.id}
                        className="vaos-appts__card--clickable vads-u-margin-bottom--3"
                      >
                        <AppointmentCard
                          appointment={appt}
                          facility={facilityData[facilityId]}
                          link={link}
                          handleClick={() =>
                            handleClick({ history, link, idClickable })
                          }
                          handleKeyDown={() =>
                            handleKeyDown({ history, link, idClickable })
                          }
                        />
                      </AppointmentListItem>
                    );
                  }
                  return null;
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
          />
        </div>
      )}
    </>
  );
}
