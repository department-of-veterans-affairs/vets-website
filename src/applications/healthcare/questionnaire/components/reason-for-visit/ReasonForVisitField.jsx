import React from 'react';
import { connect } from 'react-redux';

const ReasonForVisitField = ({ reasonForVisit }) => {
  if (reasonForVisit) {
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
  reasonForVisit: state?.clipboardAppointmentDetails?.reasonForVisit,
});

export default connect(
  mapStateToProps,
  null,
)(ReasonForVisitField);
