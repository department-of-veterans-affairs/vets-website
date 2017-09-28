import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import { systemDownMessage, unableToFindRecordWarning } from '../../common/utils/error-messages';

import { getEnrollmentData } from '../actions/post-911-gib-status';
import { noChapter33BenefitsWarning } from '../utils/helpers.jsx';

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
        appContent = <LoadingIndicator message="Loading your Post-9/11 GI Bill benefit information..."/>;
        break;
      case 'backendServiceError':
        appContent = systemDownMessage;
        break;
      case 'backendAuthenticationError':
        appContent = unableToFindRecordWarning;
        break;
      case 'noChapter33Record':
        appContent = noChapter33BenefitsWarning();
        break;
      case 'unavailable':
      default:
        appContent = systemDownMessage;
    }

    return (
      <div>
        {appContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    enrollmentData: state.post911GIBStatus.enrollmentData,
    availability: state.post911GIBStatus.availability
  };
}

const mapDispatchToProps = {
  getEnrollmentData
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
