import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../actions/appointments';
import {
  vaosCancel,
  vaosRequests,
  selectExpressCareRequests,
} from '../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { GA_PREFIX } from '../utils/constants';
import ExpressCareListItem from './ExpressCareListItem';
import NoAppointments from './NoAppointments';

export function ExpressCareList({
  showCancelButton,
  showScheduleButton,
  isCernerOnlyPatient,
  expressCareRequests,
  cancelAppointment,
  startNewAppointmentFlow,
}) {
  let content;

  if (expressCareRequests?.length > 0) {
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
                cancelAppointment={cancelAppointment}
              />
            );
          })}
        </ul>
      </>
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
            startNewAppointmentFlow();
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
  cancelAppointment: actions.cancelAppointment,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareList);
