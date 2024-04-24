import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

// import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { getEnrollmentData } from '../actions/post-911-gib-status';
import {
  backendErrorMessage,
  authenticationErrorMessage,
  genericErrorMessage,
  serviceDowntimeErrorMessage,
} from '../utils/helpers';

export class Main extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentData(this.props.apiVersion);
  }

  render() {
    let appContent;
    switch (this.props.availability) {
      case 'available':
        appContent = this.props.children;
        break;
      case 'awaitingResponse':
        appContent = (
          <va-loading-indicator message="Please wait while we check if the tool is available for you." />
        );
        break;
      case 'backendAuthenticationError':
      case 'noChapter33Record':
        appContent = authenticationErrorMessage;
        break;
      case 'getEnrollmentDataFailure':
      case 'backendServiceError':
        appContent = backendErrorMessage;
        break;
      case 'serviceDowntimeError':
        appContent = serviceDowntimeErrorMessage;
        break;
      default:
        appContent = genericErrorMessage;
    }

    return <div>{appContent}</div>;
  }
}

Main.propTypes = {
  apiVersion: PropTypes.object.isRequired,
  getEnrollmentData: PropTypes.func.isRequired,
  availability: PropTypes.string,
  children: PropTypes.node,
};

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
