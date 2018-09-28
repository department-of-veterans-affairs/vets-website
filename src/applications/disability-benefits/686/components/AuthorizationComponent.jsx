import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import DowntimeMessage from '../../../../platform/forms/save-in-progress/DowntimeMessage';
import DowntimeNotification, { externalServiceStatus } from '../../../../platform/monitoring/DowntimeNotification';

import AuthorizationMessage from './AuthorizationMessage';
import formConfig from '../config/form'; // TODO: derive from formID when generalized

class AuthorizationComponent extends React.Component {

  componentDidMount() {
    formConfig.authorize(this.props.user.profile.verified);
  }

  renderDowntime = (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = this.props.downtime.message || DowntimeMessage;

      return (
        <Message
          isAfterSteps={this.props.buttonOnly}
          downtime={downtime}/>
      );
    }

    return children;
  }

  render() {
    const { isLoading, isVisible, hasError } = this.props;

    const content = (<div>
      {isLoading && isVisible && <LoadingIndicator message="Please wait while we check your information."/>}
      {!isLoading && isVisible && !hasError && <AlertBox status="error" isVisible>
        <AuthorizationMessage user={this.props.user}/>
      </AlertBox>}
      {!hasError && this.props.children}
    </div>);

    if (formConfig.downtime) {
      return (<DowntimeNotification
        appTitle={formConfig.formId}
        render={this.renderDowntime}
        dependencies={formConfig.downtime.dependencies}>
        {content}
      </DowntimeNotification>);
    }

    return content;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    isLoading: state.authorization686.isLoading,
    hasError: state.authorization686.hasError
  };
}


export default connect(mapStateToProps)(AuthorizationComponent);

export { AuthorizationComponent };

