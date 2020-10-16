import React from 'react';
import { connect } from 'react-redux';
import { getBookingNoteFromAppointment } from '../../utils';

const ReasonForVisitField = ({ appointment }) => {
  const bookingNote = getBookingNoteFromAppointment(appointment);
  if (bookingNote?.reasonForVisit) {
    return (
      <span data-testid="reason-for-visit">
        <strong>Main reason for your appointment</strong>:{' '}
        {bookingNote?.reasonForVisit.toLowerCase()}
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
