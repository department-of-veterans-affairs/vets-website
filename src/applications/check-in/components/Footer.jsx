import React from 'react';
import { connect } from 'react-redux';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

function Footer({
  appointments,
  header = 'Need help?',
  message = 'Ask a staff member or call us at',
}) {
  const contactNumber = appointments
    ? appointments[0]?.clinicPhoneNumber
    : null;
  return (
    <footer className="row">
      <h2
        data-testid="heading"
        className="help-heading vads-u-font-size--lg vads-u-padding-bottom--1"
      >
        {header}
      </h2>
      <p data-testid="message">
        {contactNumber ? (
          <>
            {message} <Telephone contact={contactNumber} />.
          </>
        ) : (
          'Ask a staff member.'
        )}
      </p>
    </footer>
  );
}

const mapStateToProps = state => {
  return {
    appointments: state.checkInData.appointments,
  };
};

export default connect(mapStateToProps)(Footer);
