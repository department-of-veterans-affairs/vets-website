import React from 'react';
import { connect } from 'react-redux';

const ReasonForVisitView = ({ reasonForVisit = '' }) => {
  if (reasonForVisit) {
    return (
      <>
        Main reason for your visit: <strong>routine or follow-up visit</strong>
      </>
    );
  } else {
    return <>no reason to visit... </>;
  }
};

const mapStateToProps = () => ({
  reasonForVisit: '',
});

export default connect(
  mapStateToProps,
  null,
)(ReasonForVisitView);
