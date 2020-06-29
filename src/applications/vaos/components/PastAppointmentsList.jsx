import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { fetchPastAppointments } from '../actions/appointments';
import { getVAAppointmentLocationId } from '../services/appointment';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import { vaosPastAppts } from '../utils/selectors';
import {
  getRealFacilityId,
  getPastAppointmentDateRangeOptions,
} from '../utils/appointment';
import ConfirmedAppointmentListItem from './ConfirmedAppointmentListItem';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';
import { focusElement } from 'platform/utilities/ui';

export class PastAppointmentsList extends React.Component {
  constructor(props) {
    super(props);
    this.dateRangeOptions =
      props.dateRangeOptions || getPastAppointmentDateRangeOptions();
  }

  componentDidMount() {
    const { appointments, router, showPastAppointments } = this.props;

    if (!showPastAppointments) {
      router.push('/');
    } else if (appointments.pastStatus === FETCH_STATUS.notStarted) {
      const selectedDateRange = this.dateRangeOptions[
        appointments.pastSelectedIndex
      ];
      this.props.fetchPastAppointments(
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        appointments.pastSelectedIndex,
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.appointments.pastStatus === FETCH_STATUS.loading &&
      this.props.appointments.pastStatus === FETCH_STATUS.succeeded
    ) {
      focusElement('#pastAppts');
    }
  }

  onDateRangeChange = index => {
    const selectedDateRange = this.dateRangeOptions[index];

    this.props.fetchPastAppointments(
      selectedDateRange.startDate,
      selectedDateRange.endDate,
      index,
    );
  };

  render() {
    const { appointments } = this.props;
    const { past, pastStatus, facilityData } = appointments;
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
          <span className="vads-u-font-size--sm vads-u-display--block vads-u-margin-bottom--1">
            Showing appointments for:{' '}
            {this.dateRangeOptions[appointments.pastSelectedIndex].label}
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
                      facility={
                        facilityData[
                          getRealFacilityId(getVAAppointmentLocationId(appt))
                        ]
                      }
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
        <AlertBox
          status="error"
          headline="We’re sorry. We’ve run into a problem"
        >
          We’re having trouble getting your past appointments. Please try again
          later.
        </AlertBox>
      );
    } else {
      content = (
        <h4 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
          You don’t have any appointments in the selected date range
        </h4>
      );
    }

    return (
      <div role="tabpanel" aria-labelledby="tabpast" id="tabpanelpast">
        <h2 tabIndex="-1" id="pastAppts">
          Past appointments
        </h2>
        <PastAppointmentsDateDropdown
          currentRange={appointments.pastSelectedIndex}
          onChange={this.onDateRangeChange}
          options={this.dateRangeOptions}
        />
        {content}
      </div>
    );
  }
}

PastAppointmentsList.propTypes = {
  appointments: PropTypes.object,
  fetchPastAppointments: PropTypes.func,
  showPastAppointments: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    appointments: state.appointments,
    fetchPastAppointments,
    showPastAppointments: vaosPastAppts(state),
  };
}

const mapDispatchToProps = {
  fetchPastAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastAppointmentsList);
