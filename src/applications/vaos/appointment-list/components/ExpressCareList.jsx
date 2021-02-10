import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import {
  selectFeatureCancel,
  selectFeatureRequests,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';
import { selectExpressCareRequests } from '../redux/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../../utils/constants';
import ExpressCareCard from './cards/express-care/ExpressCareCard';
import NoAppointments from './NoAppointments';

export function ExpressCareList({
  showCancelButton,
  showScheduleButton,
  status,
  isCernerOnlyPatient,
  expressCareRequests,
  cancelAppointment,
  startNewAppointmentFlow,
}) {
  let content;

  if (status === FETCH_STATUS.failed) {
    content = (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your Express Care requests. Please try
        again later.
      </AlertBox>
    );
  } else if (expressCareRequests?.length > 0) {
    content = (
      <>
        <ul className="usa-unstyled-list" id="appointments-list">
          {expressCareRequests.map(appt => {
            return (
              <li
                key={appt.id}
                aria-labelledby={`card-${appt.id} card-${appt.id}-status`}
                className="vaos-appts__list-item"
              >
                <ExpressCareCard
                  appointment={appt}
                  showCancelButton={showCancelButton}
                  cancelAppointment={cancelAppointment}
                />
              </li>
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
    status: state.appointments.pendingStatus,
    showCancelButton: selectFeatureCancel(state),
    showScheduleButton: selectFeatureRequests(state),
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
