import React from 'react';
import { connect } from 'react-redux';

import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredVeteranView from '../components/RequiredVeteranView';
import EmailCapture from './EmailCapture';

function createVicSettings() {
  // vicInitialAuthStatus is used as a flag so that a user who already had the rate limit applied and allowed through
  // as an unauthorized user won't be rate limited again as an authorized user after logging in and potentially blocked.
  const disableRateLimitedAuth = window.sessionStorage.getItem('vicDisableRateLimitedAuth');
  const fromGlobal = window.settings.vic;
  const randomizer = Math.random();

  return {
    serviceRateLimitedUnauthed: randomizer > fromGlobal.rateLimitUnauthed,
    serviceRateLimitedAuthed: !disableRateLimitedAuth && randomizer > fromGlobal.rateLimitAuthed
  };
}

class VeteranIDCard extends React.Component {

  componentWillReceiveProps(nextProps) {

    // Once the login logic is all done...
    // This will occur even for unauthenticated users and should only occur once.
    if (this.props.profile.loading && !nextProps.profile.loading) {
      const userProfile = nextProps.profile;
      const { serviceRateLimitedAuthed, serviceRateLimitedUnauthed } = this.props.vicSettings;
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
          // Set the flag that the user was already rate limited and allowed to pass through as an unauthorized
          // user so that the serviceRateLimitedAuthed won't also be applied.
          window.sessionStorage.setItem('vicDisableRateLimitedAuth', 'true');
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
          <DowntimeNotification appTitle="Veteran ID Card application" dependencies={[services.vic]}>
            <RequiredVeteranView userProfile={this.props.profile}>
              {this.props.children}
            </RequiredVeteranView>
          </DowntimeNotification>
        </RequiredLoginView>
      </div>
    );
  }
}

VeteranIDCard.defaultProps = {
  vicSettings: createVicSettings()
};

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};

export default connect(mapStateToProps)(VeteranIDCard);
export { VeteranIDCard };
