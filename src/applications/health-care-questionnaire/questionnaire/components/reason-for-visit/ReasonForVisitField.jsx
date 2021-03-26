import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { appointmentSelector } from '../../../shared/utils/selectors';
import { selectCurrentAppointment } from '../../../shared/redux-selectors';

const ReasonForVisitField = ({ appointment, onChange }) => {
  const bookingNote = appointmentSelector.getBookingNote(appointment);

  useEffect(
    () => {
      if (bookingNote?.reasonForVisit) {
        onChange(bookingNote?.reasonForVisit);
      }
    },
    [onChange, bookingNote],
  );
  if (bookingNote?.reasonForVisit) {
    return (
      <section data-testid="reason-for-visit">
        <h2>
          <div>What's the reason for your visit?</div>
          <div className="reason-for-visit">{bookingNote?.reasonForVisit}</div>
        </h2>
      </section>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = state => ({
  appointment: selectCurrentAppointment(state),
});

export default connect(
  mapStateToProps,
  null,
)(ReasonForVisitField);
