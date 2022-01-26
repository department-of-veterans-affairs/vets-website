/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

class VerifyEnrollmentsPage extends React.Component {
  render() {
    return (
      <>
        <Breadcrumbs>
          <a href="/">Home</a>
          <a href="#">Education and training</a>
          <a href="#">Enrollment verifications</a>
          <a href="#">Verify your enrollments</a>
        </Breadcrumbs>

        <h1>Verify Enrollments</h1>
      </>
    );
  }
}

function mapStateToProps(state) {
  const test = state.test;
  return { test };
}

export default connect(
  mapStateToProps,
  // matchDispatchToProps,
)(VerifyEnrollmentsPage);

export { VerifyEnrollmentsPage };
