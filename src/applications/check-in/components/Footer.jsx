import React from 'react';
import { connect } from 'react-redux';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

function Footer({
  contactNumber,
  header = 'Need Help?',
  message = 'Ask a staff member or call us at',
}) {
  return (
    <footer className="row">
      <h2
        data-testid="heading"
        className="help-heading vads-u-font-size--lg vads-u-padding-bottom--1"
      >
        {header}
      </h2>
      <p data-testid="message">
        {message} <Telephone contact={contactNumber} />.
      </p>
    </footer>
  );
}

const mapStateToProps = state => {
  return {
    contactNumber: state.checkInData.appointment.clinicPhoneNumber,
  };
};

export default connect(mapStateToProps)(Footer);
