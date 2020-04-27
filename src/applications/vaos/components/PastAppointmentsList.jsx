import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { fetchPastAppointments } from '../actions/appointments';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import { vaosPastAppts } from '../utils/selectors';
import { getPastAppointmentDateRangeOptions } from '../utils/appointment';
import ConfirmedAppointmentListItem from './ConfirmedAppointmentListItem';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';

const dateRangeOptions = getPastAppointmentDateRangeOptions();

export class PastAppointmentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDateRange:
        dateRangeOptions[this.props.appointments.pastSelectedIndex],
    };
  }

  componentDidMount() {
    const { appointments, router, showPastAppointments } = this.props;
    const { selectedDateRange } = this.state;

    if (!showPastAppointments) {
      router.push('/');
    } else if (appointments.pastStatus === FETCH_STATUS.notStarted) {
      this.props.fetchPastAppointments(
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        appointments.pastSelectedIndex,
      );
    }
  }

  onDateRangeChange = e => {
    const index = Number(e.target.value);
    const selectedDateRange = dateRangeOptions[index];

    this.setState({
      selectedDateRange,
    });

    this.props.fetchPastAppointments(
      selectedDateRange.startDate,
      selectedDateRange.endDate,
      index,
    );
  };

  render() {
    const { appointments } = this.props;
    const { past, pastStatus, systemClinicToFacilityMap } = appointments;
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
          <ul className="usa-unstyled-list" id="appointments-list">
            {past.map((appt, index) => {
              switch (appt.appointmentType) {
                case APPOINTMENT_TYPES.ccAppointment:
                case APPOINTMENT_TYPES.vaAppointment:
                  return (
                    <ConfirmedAppointmentListItem
                      key={index}
                      index={index}
                      appointment={appt}
                      facility={
                        systemClinicToFacilityMap[
                          `${appt.facilityId}_${appt.clinicId}`
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
        <h3>Past appointments</h3>
        <PastAppointmentsDateDropdown
          value={appointments.pastSelectedIndex}
          onChange={this.onDateRangeChange}
          options={dateRangeOptions}
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
