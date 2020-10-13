import React from 'react';
import { connect } from 'react-redux';

const ReasonForVisitField = ({ appointment }) => {
  const bookingNote = appointment?.vdsAppointments[0]?.bookingNote;
  if (bookingNote) {
    return (
      <span data-testid="reason-for-visit">
        Main reason for your visit: <strong>routine or follow-up visit</strong>
      </span>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = state => ({
  appointment: state?.questionnaireData?.context?.appointment,
});

export default connect(
  mapStateToProps,
  null,
)(ReasonForVisitField);
