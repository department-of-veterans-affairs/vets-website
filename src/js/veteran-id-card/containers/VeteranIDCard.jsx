import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredVeteranView from '../components/RequiredVeteranView';
import EmailCapture from './EmailCapture';

const rateLimitAuthed = window.settings.vic.rateLimitAuthed;
const rateLimitUnauthed = window.settings.vic.rateLimitUnauthed;

class VeteranIDCard extends React.Component {

  componentDidMount() {
    // Redirect users to email form based on rate limits for unauthed or authed users
    if (this.props.profile.accountType) {
      if (this.props.serviceRateLimitedAuthed) {
        window.dataLayer.push({ event: 'vic-authenticated-ratelimited' });
        this.renderEmailCapture = true;
      } else {
        window.dataLayer.push({ event: 'vic-authenticated' });
      }
    } else {
      if (this.props.serviceRateLimitedUnauthed) {
        window.dataLayer.push({ event: 'vic-unauthenticated-ratelimited' });
        this.renderEmailCapture = true;
      } else {
        window.dataLayer.push({ event: 'vic-unauthenticated' });
      }
    }

    if (this.renderEmailCapture === true) {
      // Report if they will see an error message around eMIS status
      if (this.props.profile.veteranStatus === 'NOT_FOUND') {
        window.dataLayer.push({ events: 'vic-emis-lookup-failed' });
      } else if (this.props.profile.veteranStatus === 'SERVER_ERROR') {
        window.dataLayer.push({ events: 'vic-emis-error' });
      }
    }
  }

  render() {
    if (this.renderEmailCapture) {
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

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl,
    serviceRateLimitedAuthed: Math.random() > rateLimitAuthed,
    serviceRateLimitedUnauthed: Math.random() > rateLimitUnauthed
  };
};

export default connect(mapStateToProps)(VeteranIDCard);
export { VeteranIDCard };
