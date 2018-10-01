import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import DowntimeMessage from '../../../../platform/forms/save-in-progress/DowntimeMessage';
import DowntimeNotification, { externalServiceStatus } from '../../../../platform/monitoring/DowntimeNotification';
import { getFormAuthorizationState } from '../../../../applications/personalization/dashboard/helpers.jsx';

import AuthorizationMessage from './AuthorizationMessage';

class AuthorizationComponent extends React.Component {

  componentDidMount() {
    if (this.props.formConfig) {
      this.props.formConfig.authorize();
    }
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
    const { isLoading, isVisible, hasError, isLoggedIn, isVerified, profileStatus, has30PercentDisabilityRating, formConfig } = this.props;

    const content = (<div>
      {isLoading && isVisible && <LoadingIndicator message="Please wait while we check your information."/>}
      {!isLoading && isVisible && hasError && <AlertBox status="error" isVisible>
        <AuthorizationMessage has30PercentDisabilityRating={has30PercentDisabilityRating} user={ { isLoggedIn, isVerified, profileStatus }}/>
      </AlertBox>}
      {!hasError && this.props.children}
    </div>);

    if (formConfig && formConfig.downtime) {
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

function mapStateToProps(state, ownProps) {
  if (ownProps.formConfig) {
    return getFormAuthorizationState(ownProps.formConfig, state);
  }
  return {};
}

function mapDispatchToProps(dispatch, ownProps) {
  if (ownProps.formConfig) {
    return {
      authorize: bindActionCreators(ownProps.formConfig.authorize, dispatch)
    };
  }
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizationComponent);

export { AuthorizationComponent };

