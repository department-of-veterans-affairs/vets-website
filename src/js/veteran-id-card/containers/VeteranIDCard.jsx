import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredVeteranView from '../components/RequiredVeteranView';
import EmailCapture from './EmailCapture';

const rateLimitAuthed = window.settings.vic.rateLimitAuthed;
const rateLimitUnauthed = window.settings.vic.rateLimitUnauthed;
const serviceRateLimitedRandomizer = Math.random();

class VeteranIDCard extends React.Component {

  componentWillReceiveProps(nextProps) {

    // Once the login logic is all done...
    // This will occur even for unauthenticated users and should only occur once.
    if (this.props.profile.loading && !nextProps.profile.loading) {
      const userProfile = nextProps.profile;
      const serviceRateLimitedAuthed = this.props.serviceRateLimitedRandomizer > this.props.rateLimitAuthed;
      const serviceRateLimitedUnauthed = this.props.serviceRateLimitedRandomizer > this.props.rateLimitUnauthed;
      const isloggedIn = !!userProfile.accountType;

      if (isloggedIn) {
        if (serviceRateLimitedAuthed) {
          window.dataLayer.push({ event: 'vic-authenticated-ratelimited' });
          this.renderEmailCapture = true;
          if (userProfile.veteranStatus === 'NOT_FOUND') {
            window.dataLayer.push({ events: 'vic-emis-lookup-failed' });
          } else if (userProfile.veteranStatus === 'SERVER_ERROR') {
            window.dataLayer.push({ events: 'vic-emis-error' });
          }
        } else {
          window.dataLayer.push({ event: 'vic-authenticated' });
        }
      } else {
        if (serviceRateLimitedUnauthed) {
          window.dataLayer.push({ event: 'vic-unauthenticated-ratelimited' });
          this.renderEmailCapture = true;
        } else {
          window.dataLayer.push({ event: 'vic-unauthenticated' });
        }
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
    rateLimitAuthed,
    rateLimitUnauthed,
    serviceRateLimitedRandomizer
  };
};

export default connect(mapStateToProps)(VeteranIDCard);
export { VeteranIDCard };
