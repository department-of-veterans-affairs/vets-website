import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { focusElement } from 'platform/utilities/ui';
import * as actions from '../../redux/actions';
import { getVAAppointmentLocationId } from '../../../services/appointment';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../../../utils/constants';
import {
  selectPastAppointments,
  selectExpressCareAvailability,
} from '../../redux/selectors';
import ConfirmedAppointmentListItem from '../cards/confirmed/ConfirmedAppointmentListItem';
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

function PastAppointmentsList({
  expressCare,
  dateRangeOptions = getPastAppointmentDateRangeOptions(),
  past,
  pastSelectedIndex,
  pastStatus,
  facilityData,
  fetchPastAppointments,
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
        focusElement('#queryResultLabel');
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
        <LoadingIndicator message="Loading your appointments..." />
      </div>
    );
  } else if (pastStatus === FETCH_STATUS.succeeded && past?.length > 0) {
    content = (
      <>
        <span
          id="queryResultLabel"
          className="vads-u-font-size--sm vads-u-display--block vads-u-margin-bottom--1"
          style={{ outline: 'none' }}
        >
          Showing appointments for: {dateRangeOptions[pastSelectedIndex].label}
        </span>
        <ul className="usa-unstyled-list" id="appointments-list">
          {past.map((appt, index) => {
            switch (appt.vaos?.appointmentType) {
              case APPOINTMENT_TYPES.ccAppointment:
              case APPOINTMENT_TYPES.vaAppointment:
                return (
                  <ConfirmedAppointmentListItem
                    key={index}
                    index={index}
                    appointment={appt}
                    facility={facilityData[getVAAppointmentLocationId(appt)]}
                  />
                );
              default:
                return null;
            }
          })}
        </ul>
      </>
    );
  } else if (pastStatus === FETCH_STATUS.failed) {
    content = (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your past appointments. Please try again
        later.
      </AlertBox>
    );
  } else {
    content = (
      <h3 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        You don’t have any appointments in the selected date range
      </h3>
    );
  }

  return (
    <div role="tabpanel" aria-labelledby="tabpast" id="tabpanelpast">
      {!expressCare.hasRequests && (
        <h2 tabIndex="-1" id="pastAppts" className="vads-u-font-size--h3">
          Past appointments
        </h2>
      )}
      <PastAppointmentsDateDropdown
        currentRange={pastSelectedIndex}
        onChange={onDateRangeChange}
        options={dateRangeOptions}
      />
      {content}
    </div>
  );
}

PastAppointmentsList.propTypes = {
  past: PropTypes.array,
  pastStatus: PropTypes.string,
  pastSelectedIndex: PropTypes.number,
  facilityData: PropTypes.object,
  fetchPastAppointments: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    past: selectPastAppointments(state),
    pastStatus: state.appointments.pastStatus,
    pastSelectedIndex: state.appointments.pastSelectedIndex,
    facilityData: state.appointments.facilityData,
    expressCare: selectExpressCareAvailability(state),
  };
}

const mapDispatchToProps = {
  fetchPastAppointments: actions.fetchPastAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastAppointmentsList);
