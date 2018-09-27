import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import DowntimeMessage from '../../../../platform/forms/save-in-progress/DowntimeMessage';
import DowntimeNotification, { externalServiceStatus } from '../../../../platform/monitoring/DowntimeNotification';

import AuthorizationMessage from './AuthorizationMessage';


export default class AuthorizationComponent extends React.Component {

  componentDidMount() {
    this.props.authorize(this.props.user.profile.verified);
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
    const { isLoading, isVisible, isAuthorized } = this.props;

    const content = (<div>
      {isLoading && isVisible && <LoadingIndicator message="Please wait while we check your information."/>}
      {!isLoading && isVisible && !this.props.isAuthorized && <AlertBox status="error" isVisible>
        <AuthorizationMessage user={this.props.user}/>
      </AlertBox>}
      {isAuthorized && this.props.children}
    </div>);

    if (this.props.downtime) {
      return (<DowntimeNotification
        appTitle={this.props.formId}
        render={this.renderDowntime}
        dependencies={this.props.downtime.dependencies}>
        {content}
      </DowntimeNotification>);
    }

    return content;
  }
}

// TODO: connect component
