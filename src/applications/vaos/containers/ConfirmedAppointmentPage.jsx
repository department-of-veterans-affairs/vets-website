import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { focusElement } from 'platform/utilities/ui';
import { fetchConfirmedAppointments } from '../actions/appointments';
import { FETCH_STATUS, PURPOSE_TEXT } from '../utils/constants';
import { selectConfirmedAppointment } from '../utils/selectors';
import { formatTimeToCall } from '../utils/formatters';
import Breadcrumbs from '../components/Breadcrumbs';

function formatDate(date) {
  const parsedDate = moment(date, 'MM/DD/YYYY hh:mm:ss');

  if (!parsedDate.isValid()) {
    return '';
  }

  return {
    date: parsedDate.format('MMMM D, YYYY'),
    time: parsedDate.format('h:mm a'),
  };
}

export class ConfirmedAppointmentPage extends React.Component {
  componentDidMount() {
    this.props.fetchConfirmedAppointments();
    focusElement('h1');
  }
  render() {
    const { appointment, status } = this.props;

    const formattedDateTime = appointment?.bookedApptDateTime
      ? formatDate(appointment.bookedApptDateTime)
      : {};

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs>
          <Link to="appointments">Your appointments</Link>
          <Link to="appointments/confirmed">Confirmed appointments</Link>
          <Link to="appointments/confirmed">Appointment detail</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <Link to="appointments/confirmed">
              <i className="fas fa-angle-left" /> Back
            </Link>
            <h1 className="vads-u-margin-bottom--4 vads-u-margin-top--1">
              Appointment details
            </h1>
            {status === FETCH_STATUS.loading && (
              <LoadingIndicator message="Loading appointment" />
            )}
            {status === FETCH_STATUS.succeeded && (
              <>
                <h2>{appointment.appointmentType}</h2>
                <div className="vads-u-display--flex vads-u-margin-bottom--2">
                  <div className="vads-u-flex--1">
                    <>
                      <h3 className="vaos-appts__block-label">Where</h3>
                      {appointment.friendlyLocationName ||
                        appointment.facility.name}
                      <br />
                      {appointment.facility.city}, {appointment.facility.state}
                    </>
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      When
                    </h3>
                    {formattedDateTime.date}
                    <br />
                    {formattedDateTime.time}
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      Purpose
                    </h3>
                    {PURPOSE_TEXT[appointment.purposeOfVisit] ||
                      appointment.reasonForVisit}
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      Type
                    </h3>
                    {appointment.visitType}
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      My contact number
                    </h3>
                    {appointment.phoneNumber}, in the{' '}
                    {formatTimeToCall(appointment.bestTimetoCall)}
                  </div>
                </div>
                <Link to="appointments/confirmed">
                  <i className="fas fa-angle-left" /> Back
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ConfirmedAppointmentPage.propTypes = {
  appointment: PropTypes.object,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    appointment: selectConfirmedAppointment(state, ownProps.params.id),
    status: state.appointments.confirmedStatus,
  };
}

const mapDispatchToProps = {
  fetchConfirmedAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmedAppointmentPage);
