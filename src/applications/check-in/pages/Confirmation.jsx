import React from 'react';
import { connect } from 'react-redux';
import { VaAlert } from 'web-components/react-bindings';

import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import AppointmentLocation from '../components/AppointmentLocation';

const Confirmation = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <VaAlert status="success" onVaOnLoad={() => focusElement('h1')}>
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
      </VaAlert>
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
