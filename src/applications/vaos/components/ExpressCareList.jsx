import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import {
  cancelAppointment,
  fetchFutureAppointments,
  startNewAppointmentFlow,
} from '../actions/appointments';
import {
  vaosCancel,
  vaosRequests,
  selectExpressCareRequests,
} from '../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { FETCH_STATUS, GA_PREFIX } from '../utils/constants';
import ExpressCareListItem from './ExpressCareListItem';
import NoAppointments from './NoAppointments';

export class ExpressCareList extends React.Component {
  componentDidMount() {
    if (this.props.status === FETCH_STATUS.notStarted) {
      this.props.fetchFutureAppointments();
    }
  }

  render() {
    const {
      showCancelButton,
      showScheduleButton,
      isCernerOnlyPatient,
      expressCareRequests,
      status,
    } = this.props;

    let content;

    if (status === FETCH_STATUS.loading) {
      content = (
        <div className="vads-u-margin-y--8">
          <LoadingIndicator message="Loading your Express Care requests..." />
        </div>
      );
    } else if (
      status === FETCH_STATUS.succeeded &&
      expressCareRequests?.length > 0
    ) {
      content = (
        <>
          <ul className="usa-unstyled-list" id="appointments-list">
            {expressCareRequests.map((appt, index) => {
              return (
                <ExpressCareListItem
                  key={index}
                  index={index}
                  appointment={appt}
                  showCancelButton={showCancelButton}
                  cancelAppointment={this.props.cancelAppointment}
                />
              );
            })}
          </ul>
        </>
      );
    } else if (status === FETCH_STATUS.failed) {
      content = (
        <AlertBox
          status="error"
          headline="We’re sorry. We’ve run into a problem"
        >
          We’re having trouble getting your upcoming appointments. Please try
          again later.
        </AlertBox>
      );
    } else {
      content = (
        <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
          <NoAppointments
            showScheduleButton={showScheduleButton}
            isCernerOnlyPatient={isCernerOnlyPatient}
            startNewAppointmentFlow={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              this.props.startNewAppointmentFlow();
            }}
          />
        </div>
      );
    }

    return (
      <div
        role="tabpanel"
        aria-labelledby="tabexpress-care"
        id="tabpanelexpress-care"
      >
        {content}
      </div>
    );
  }
}

ExpressCareList.propTypes = {
  isCernerOnlyPatient: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showScheduleButton: PropTypes.bool,
  expressCareRequests: PropTypes.array,
  status: PropTypes.string,
  cancelAppointment: PropTypes.func,
  fetchFutureAppointments: PropTypes.func,
  startNewAppointmentFlow: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    expressCareRequests: selectExpressCareRequests(state),
    status: state.appointments.futureStatus,
    showCancelButton: vaosCancel(state),
    showScheduleButton: vaosRequests(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
  };
}

const mapDispatchToProps = {
  cancelAppointment,
  fetchFutureAppointments,
  startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareList);
