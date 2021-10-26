import React from 'react';
import PropTypes from 'prop-types';

import { VaAlert } from 'web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import AppointmentLocation from '../../components/AppointmentDisplay/AppointmentLocation';

const SingleAppointment = props => {
  const { appointments } = props;
  const appointment = appointments[0];

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
          Please wait in the <AppointmentLocation appointment={appointment} />{' '}
          waiting room. We’ll come get you when it’s time for your appointment
          to start.
        </p>
      </VaAlert>
      <Footer />
      <BackToHome />
    </div>
  );
};

SingleAppointment.propTypes = {
  appointments: PropTypes.array,
};

export default SingleAppointment;
