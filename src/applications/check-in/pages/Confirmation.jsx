import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import AppointmentLocation from '../components/AppointmentLocation';

const Confirmation = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <va-alert status="success">
        <h1
          tabIndex="-1"
          aria-label="Thank you for checking in. "
          slot="headline"
        >
          You’re checked in
        </h1>
        <p>
          Please wait in the <AppointmentLocation /> waiting room. We’ll come
          get you when it’s time for your appointment to start.
        </p>
      </va-alert>
      <Footer header={'Not sure where to wait?'} />
      <BackToHome />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    appointment: state.checkInData.appointment,
  };
};
const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);
