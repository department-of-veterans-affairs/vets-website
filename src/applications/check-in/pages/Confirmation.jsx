import React from 'react';
import { connect } from 'react-redux';
import { VaAlert } from 'web-components/react-bindings';
import format from 'date-fns/format';

import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import AppointmentLocation from '../components/AppointmentDisplay/AppointmentLocation';

import FeatureToggle, {
  FeatureOn,
  FeatureOff,
} from '../components/FeatureToggle';

const Confirmation = ({
  _appointments,
  selectedAppointment,
  isMultipleAppointmentsEnabled,
}) => {
  const appointment = selectedAppointment;
  const appointmentDateTime = new Date(appointment.startTime);
  const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
  return (
    <FeatureToggle on={isMultipleAppointmentsEnabled}>
      <FeatureOn>
        <div className="vads-l-grid-container vads-u-padding-y--5">
          <VaAlert
            status="success"
            onVa-component-did-load={() => {
              focusElement('h1');
            }}
          >
            <h1
              tabIndex="-1"
              aria-label="Thank you for checking in. "
              slot="headline"
            >
              You’re checked in for your {appointmentTime} appointment
            </h1>
            <p>
              We’ll come get you from the{' '}
              <AppointmentLocation appointment={appointment} bold /> waiting
              room when it’s time for your appointment to start.
            </p>
          </VaAlert>
          <Footer />
          <BackToHome />
        </div>
      </FeatureOn>
      <FeatureOff>
        <div className="vads-l-grid-container vads-u-padding-y--5">
          <VaAlert
            status="success"
            onVa-component-did-load={() => {
              focusElement('h1');
            }}
          >
            <h1
              tabIndex="-1"
              aria-label="Thank you for checking in. "
              slot="headline"
            >
              You’re checked in
            </h1>
            <p>
              Please wait in the{' '}
              <AppointmentLocation appointment={appointment} /> waiting room.
              We’ll come get you when it’s time for your appointment to start.
            </p>
          </VaAlert>
          <Footer />
          <BackToHome />
        </div>
      </FeatureOff>
    </FeatureToggle>
  );
};

const mapStateToProps = state => {
  return {
    appointments: state.checkInData.appointments,
    selectedAppointment: state.checkInData.context.appointment,
  };
};
const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);
