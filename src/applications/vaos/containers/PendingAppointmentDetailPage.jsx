import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { focusElement } from 'platform/utilities/ui';
import { fetchPendingAppointments } from '../actions/appointments';
import { FETCH_STATUS, TIME_TEXT, PURPOSE_TEXT } from '../utils/constants';
import { selectPendingAppointment } from '../utils/selectors';
import { formatTimeToCall } from '../utils/formatters';
import Breadcrumbs from '../components/Breadcrumbs';

function formatDate(date) {
  const parsedDate = moment(date, 'MM/DD/YYYY');

  if (!parsedDate.isValid()) {
    return '';
  }

  return parsedDate.format('MMMM D, YYYY');
}

export class PendingAppointmentDetailPage extends React.Component {
  componentDidMount() {
    this.props.fetchPendingAppointments();
    focusElement('h1');
  }
  render() {
    const { appointment, status } = this.props;
    const isCommunityCare = !!appointment?.ccAppointmentRequest;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs>
          <Link to="appointments">Your appointments</Link>
          <Link to="appointments/pending">Pending appointments</Link>
          <Link to="appointments/pending">Appointment details</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <Link to="appointments/pending">
              <i className="fas fa-angle-left" /> Back
            </Link>
            <h1 className="vads-u-margin-bottom--4 vads-u-margin-top--1">
              Appointment details
            </h1>
            <AlertBox
              level="2"
              status="warning"
              headline="You don't have a scheduled appointment yet"
            >
              We will call you within 48 hours to confirm and appointment time.
            </AlertBox>
            {status === FETCH_STATUS.loading && (
              <LoadingIndicator message="Loading pending appointment" />
            )}
            {status === FETCH_STATUS.succeeded && (
              <>
                <h2>{appointment.appointmentType}</h2>
                <div className="vads-u-display--flex vads-u-margin-bottom--2">
                  <div className="vads-u-flex--1">
                    {!isCommunityCare && (
                      <>
                        <h3 className="vaos-appts__block-label">Where</h3>
                        {appointment.friendlyLocationName ||
                          appointment.facility.name}
                        <br />
                        {appointment.facility.city},{' '}
                        {appointment.facility.state}
                      </>
                    )}
                    {isCommunityCare && (
                      <>
                        <h3 className="vaos-appts__block-label">
                          Preferred location
                        </h3>
                        {appointment.ccAppointmentRequest.preferredCity},{' '}
                        {appointment.ccAppointmentRequest.preferredState}
                      </>
                    )}
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      Purpose
                    </h3>
                    {PURPOSE_TEXT[appointment.purposeOfVisit] ||
                      appointment.purposeOfVisit}
                    <br />
                    {appointment.otherPurposeOfVisit}
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      Type
                    </h3>
                    {appointment.visitType}
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      Preferred appointment dates
                    </h3>
                    <ul className="usa-unstyled-list">
                      <li className="vads-u-margin-bottom--1">
                        {formatDate(appointment.optionDate1)}{' '}
                        {TIME_TEXT[appointment.optionTime1]}
                      </li>
                      <li className="vads-u-margin-bottom--1">
                        {formatDate(appointment.optionDate2)}{' '}
                        {TIME_TEXT[appointment.optionTime2]}
                      </li>
                      <li>
                        {formatDate(appointment.optionDate3)}{' '}
                        {TIME_TEXT[appointment.optionTime3]}
                      </li>
                    </ul>
                    <h3 className="vaos-appts__block-label vads-u-margin-top--2">
                      My contact number
                    </h3>
                    {appointment.phoneNumber}, in the{' '}
                    {formatTimeToCall(appointment.bestTimetoCall)}
                  </div>
                </div>
                <Link to="appointments/pending">
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

PendingAppointmentDetailPage.propTypes = {
  appointment: PropTypes.object,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    appointment: selectPendingAppointment(state, ownProps.params.id),
    status: state.appointments.pendingStatus,
  };
}

const mapDispatchToProps = {
  fetchPendingAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PendingAppointmentDetailPage);
