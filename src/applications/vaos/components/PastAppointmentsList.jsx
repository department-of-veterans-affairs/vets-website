import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { fetchPastAppointments } from '../actions/appointments';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import { vaosPastAppts } from '../utils/selectors';
import {
  getAppointmentType,
  getPastAppointmentDateRangeOptions,
} from '../utils/appointment';
import ConfirmedAppointmentListItem from './ConfirmedAppointmentListItem';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';
import TabNav from './TabNav';

const dateRangeOptions = getPastAppointmentDateRangeOptions();

export class PastAppointmentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDateRangeIndex: 0,
      selectedDateRange: dateRangeOptions[0],
    };
  }

  componentDidMount() {
    if (!this.props.showPastAppointments) {
      this.props.router.push('/');
    } else {
      this.props.fetchPastAppointments(
        this.state.selectedDateRange.startDate,
        this.state.selectedDateRange.endDate,
      );
    }
  }

  onDateRangeChange = e => {
    const index = Number(e.target.value);
    const selectedDateRange = dateRangeOptions[index];

    this.setState({
      selectedDateRangeIndex: index,
      selectedDateRange,
    });

    this.props.fetchPastAppointments(
      selectedDateRange.startDate,
      selectedDateRange.endDate,
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
              const type = getAppointmentType(appt);

              switch (type) {
                case APPOINTMENT_TYPES.ccAppointment:
                case APPOINTMENT_TYPES.vaAppointment:
                  return (
                    <ConfirmedAppointmentListItem
                      key={index}
                      index={index}
                      appointment={appt}
                      type={type}
                      facility={
                        systemClinicToFacilityMap[
                          `${appt.facilityId}_${appt.clinicId}`
                        ]
                      }
                      isPastAppointment
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
      <>
        <TabNav />
        <h3>Past appointments</h3>
        <PastAppointmentsDateDropdown
          value={this.state.selectedDateRangeIndex}
          onChange={this.onDateRangeChange}
          options={dateRangeOptions}
        />
        {content}
      </>
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
    fetchPastAppointments: PropTypes.func,
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
