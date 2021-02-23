import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../../redux/actions';
import { focusElement } from 'platform/utilities/ui';
import { selectPastAppointmentsV2 } from '../../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
} from '../../../utils/constants';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import AppointmentListItem from '../AppointmentsPage/AppointmentListItem';
import ExpressCareListItem from '../AppointmentsPage/ExpressCareListItem';
import NoAppointments from '../NoAppointments';
import moment from 'moment';
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

function PastAppointmentsListNew({
  showScheduleButton,
  dateRangeOptions = getPastAppointmentDateRangeOptions(),
  pastAppointmentsByMonth,
  pastStatus,
  facilityData,
  fetchPastAppointments,
  startNewAppointmentFlow,
  pastSelectedIndex,
}) {
  const [isInitialMount, setInitialMount] = useState(true);
  useEffect(() => {
    if (pastStatus === FETCH_STATUS.notStarted) {
      const selectedDateRange = dateRangeOptions[pastSelectedIndex];
      fetchPastAppointments(
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        pastSelectedIndex,
      );
    }
  }, []);
  useEffect(
    () => {
      if (pastStatus === FETCH_STATUS.succeeded && !isInitialMount) {
        focusElement('h3');
      }
    },
    [isInitialMount, pastStatus],
  );

  const onDateRangeChange = index => {
    const selectedDateRange = dateRangeOptions[index];

    setInitialMount(false);
    fetchPastAppointments(
      selectedDateRange.startDate,
      selectedDateRange.endDate,
      index,
    );
  };

  let content;

  if (pastStatus === FETCH_STATUS.loading) {
    content = (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your upcoming appointments..." />
      </div>
    );
  } else if (
    pastStatus === FETCH_STATUS.succeeded &&
    pastAppointmentsByMonth?.length > 0
  ) {
    content = (
      <>
        {pastAppointmentsByMonth.map((monthBucket, monthIndex) => {
          const monthDate = moment(monthBucket[0].start);
          return (
            <React.Fragment key={monthIndex}>
              <h3 id={`appointment_list_${monthDate.format('YYYY-MM')}`}>
                <span className="sr-only">Appointments in </span>
                {monthDate.format('MMMM YYYY')}
              </h3>
              <ul
                aria-labelledby={`appointment_list_${monthDate.format(
                  'YYYY-MM',
                )}`}
                className="vads-u-padding-left--0"
              >
                {monthBucket.map((appt, index) => {
                  const facilityId = getVAAppointmentLocationId(appt);

                  if (
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.vaAppointment ||
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.ccAppointment
                  ) {
                    return (
                      <AppointmentListItem
                        key={index}
                        appointment={appt}
                        facility={facilityData[facilityId]}
                      />
                    );
                  } else if (appt.vaos.isExpressCare) {
                    return (
                      <ExpressCareListItem key={index} appointment={appt} />
                    );
                  }
                  return null;
                })}
              </ul>
            </React.Fragment>
          );
        })}
      </>
    );
  } else if (pastStatus === FETCH_STATUS.failed) {
    content = (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your past appointments. Please try later.
      </AlertBox>
    );
  } else {
    content = (
      <NoAppointments
        showScheduleButton={showScheduleButton}
        startNewAppointmentFlow={() => {
          recordEvent({
            event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
          });
          startNewAppointmentFlow();
        }}
      />
    );
  }

  return (
    <>
      <PastAppointmentsDateDropdown
        currentRange={pastSelectedIndex}
        onChange={onDateRangeChange}
        options={dateRangeOptions}
      />
      {content}
    </>
  );
}

PastAppointmentsListNew.propTypes = {
  pastSelectedIndex: PropTypes.number,
  fetchPastAppointments: PropTypes.func,
  showScheduleButton: PropTypes.bool,
  startNewAppointmentFlow: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    pastAppointmentsByMonth: selectPastAppointmentsV2(state),
    pastStatus: state.appointments.pastStatus,
    pastSelectedIndex: state.appointments.pastSelectedIndex,
    facilityData: state.appointments.facilityData,
  };
}

const mapDispatchToProps = {
  fetchPastAppointments: actions.fetchPastAppointments,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastAppointmentsListNew);
