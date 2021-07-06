import React from 'react';
import { connect } from 'react-redux';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

function Footer({ contactNumber, header = 'Need Help?' }) {
  return (
    <footer className="row">
      <h2 data-testid="heading" className="help-heading vads-u-font-size--lg">
        {header}
      </h2>
      <p>
        Ask a staff member or call us at <Telephone contact={contactNumber} />.
      </p>
    </footer>
  );
}

const mapStateToProps = state => {
  return {
    contactNumber: state.checkInData.appointment.clinicPhone,
  };
};

export default connect(mapStateToProps)(Footer);
