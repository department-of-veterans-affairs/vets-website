import React from 'react';
import { connect } from 'react-redux';

const ReasonForVisitField = ({ reasonForVisit = '' }) => {
  if (reasonForVisit) {
    return (
      <>
        Main reason for your visit: <strong>routine or follow-up visit</strong>
      </>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = () => ({
  reasonForVisit: '',
});

export default connect(
  mapStateToProps,
  null,
)(ReasonForVisitField);
