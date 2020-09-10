import React from 'react';
import { connect } from 'react-redux';

const ChiefComplaintField = ({ chiefComplaint }) => {
  return <div>{chiefComplaint}</div>;
};

const mapStateToProps = () => ({
  chiefComplaint: 'Pain in right knee',
});

export default connect(
  mapStateToProps,
  null,
)(ChiefComplaintField);
