import React from 'react';
import { connect } from 'react-redux';

import { getEnrollmentStatus } from '../actions';

import EnrollmentStatusWarning from '../components/FormAlerts/EnrollmentStatusWarning';
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
          <EnrollmentStatusWarning {...this.props} />
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
