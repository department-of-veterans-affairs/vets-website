import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredVeteranView from '../components/RequiredVeteranView';
import EmailCapture from './EmailCapture';

const rateLimit = window.settings.vic.rateLimit;

class VeteranIDCard extends React.Component {

  componentDidMount() {
    if (this.props.serviceRateLimitEnabled) {
      window.dataLayer.push({ event: 'vic-ratelimited' });
    }
  }

  render() {
    if (this.props.serviceRateLimitEnabled) {
      return <EmailCapture/>;
    }

    return (
      <div>
        <RequiredLoginView
          authRequired={3}
          serviceRequired="id-card"
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <RequiredVeteranView userProfile={this.props.profile}>
            {this.props.children}
          </RequiredVeteranView>
        </RequiredLoginView>
      </div>
    );
  }
}


VeteranIDCard.propTypes = {
  serviceRateLimitEnabled: PropTypes.bool,
};

VeteranIDCard.defaultProps = {
  serviceRateLimitEnabled: Math.random() > rateLimit
};

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl,
  };
};

export default connect(mapStateToProps)(VeteranIDCard);
export { VeteranIDCard };
