/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

class EnrollmentVerificationPage extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  // componentDidMount() {
  // }

  render() {
    return (
      <>
        <Breadcrumbs>
          <a href="/">Home</a>
          <a href="#">Education and training</a>
          <a href="#">Enrollment verifications</a>
        </Breadcrumbs>

        <h1>Enrollment Verification</h1>
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
)(EnrollmentVerificationPage);

export { EnrollmentVerificationPage };
