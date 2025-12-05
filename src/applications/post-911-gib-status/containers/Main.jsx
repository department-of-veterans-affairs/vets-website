import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { getEnrollmentData } from '../actions/post-911-gib-status';
import {
  authenticationErrorMessage,
  genericErrorMessage,
} from '../utils/helpers';

export class Main extends React.Component {
  componentDidMount() {
    const {
      apiVersion,
      enableSobClaimantService,
      getEnrollmentData: getEnrollmentDataFromProps,
    } = this.props;
    getEnrollmentDataFromProps(apiVersion, enableSobClaimantService);
  }

  render() {
    const { availability, children } = this.props;
    let appContent;
    switch (availability) {
      case 'available':
        appContent = children;
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
      case 'serviceDowntimeError':
      case 'getEnrollmentDataFailure':
      case 'backendServiceError':
        appContent = genericErrorMessage;
        break;
      default:
        appContent = genericErrorMessage;
    }

    return <div id="appContent">{appContent}</div>;
  }
}

Main.propTypes = {
  apiVersion: PropTypes.object.isRequired,
  getEnrollmentData: PropTypes.func.isRequired,
  availability: PropTypes.string,
  children: PropTypes.node,
  enableSobClaimantService: PropTypes.bool,
};

export function mapStateToProps(state) {
  const toggles = toggleValues(state);
  const enableSobClaimantService =
    toggles?.[FEATURE_FLAG_NAMES.sobClaimantService] ?? false;
  return {
    enrollmentData: state.post911GIBStatus.enrollmentData,
    availability: state.post911GIBStatus.availability,
    enableSobClaimantService,
  };
}

const mapDispatchToProps = {
  getEnrollmentData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
