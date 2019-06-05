import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { getEnrollmentData } from '../actions/post-911-gib-status';
import {
  backendErrorMessage,
  authenticationErrorMessage,
} from '../utils/helpers';

export class Main extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentData();
  }

  render() {
    let appContent;
    switch (this.props.availability) {
      case 'available':
        appContent = this.props.children;
        break;
      case 'awaitingResponse':
        appContent = (
          <LoadingIndicator message="Please wait while we check if the tool is available for you." />
        );
        break;
      case 'backendAuthenticationError':
      case 'noChapter33Record':
        appContent = authenticationErrorMessage;
        break;
      case 'unavailable':
      case 'backendServiceError':
      default:
        appContent = backendErrorMessage;
    }

    return <div>{appContent}</div>;
  }
}

function mapStateToProps(state) {
  return {
    enrollmentData: state.post911GIBStatus.enrollmentData,
    availability: state.post911GIBStatus.availability,
  };
}

const mapDispatchToProps = {
  getEnrollmentData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
