import React from 'react';
import { connect } from 'react-redux';
import { getBookingNoteFromAppointment } from '../../utils';

const ReasonForVisitField = ({ appointment }) => {
  const bookingNote = getBookingNoteFromAppointment(appointment);
  if (bookingNote?.reasonForVisit) {
    return (
      <section data-testid="reason-for-visit">
        <strong>What's the reason for your visit?</strong>
        <p className="reason-for-visit">{bookingNote?.reasonForVisit}</p>
      </section>
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
