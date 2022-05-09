/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';

import { getEnrollmentStatus } from '../actions';

import HCAEnrollmentStatusWarning from '../components/HCAEnrollmentStatusWarning';
import HCAEnrollmentStatusFAQ from '../components/HCAEnrollmentStatusFAQ';

class HCAEnrollmentStatus extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentStatus();
  }

  render() {
    const { enrollmentStatus, route } = this.props;
    if (enrollmentStatus) {
      return (
        <>
          <HCAEnrollmentStatusWarning {...this.props} />
          <HCAEnrollmentStatusFAQ
            enrollmentStatus={enrollmentStatus}
            route={route}
          />
        </>
      );
    }
    return null;
  }
}

export { HCAEnrollmentStatus };

const mapStateToProps = state => {
  const {
    applicationDate,
    enrollmentDate,
    enrollmentStatus,
    preferredFacility,
  } = state.hcaEnrollmentStatus;
  return {
    applicationDate,
    enrollmentDate,
    enrollmentStatus,
    preferredFacility,
  };
};

const mapDispatchToProps = {
  getEnrollmentStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HCAEnrollmentStatus);
