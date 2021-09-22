import React from 'react';
import { connect } from 'react-redux';

function Footer({ header = 'Need help?', message = 'Ask a staff member.' }) {
  return (
    <footer className="row">
      <h2
        data-testid="heading"
        className="help-heading vads-u-font-size--lg vads-u-padding-bottom--1"
      >
        {header}
      </h2>
      <p data-testid="message">{message}</p>
    </footer>
  );
}

const mapStateToProps = state => {
  return {
    appointments: state.checkInData.appointments,
  };
};

export default connect(mapStateToProps)(Footer);
