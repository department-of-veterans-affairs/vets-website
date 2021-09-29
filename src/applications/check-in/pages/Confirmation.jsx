import React from 'react';
import { connect } from 'react-redux';
import { VaAlert } from 'web-components/react-bindings';

import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import AppointmentLocation from '../components/AppointmentDisplay/AppointmentLocation';

const Confirmation = ({ _appointments, selectedAppointment }) => {
  const appointment = selectedAppointment;
  return (
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
          <AppointmentLocation appointment={appointment} bold /> waiting room.
          We’ll come get you when it’s time for your appointment to start.
        </p>
      </VaAlert>
      <Footer />
      <BackToHome />
    </div>
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
