import React from 'react';
import { connect } from 'react-redux';
import { getVerifyUrl } from '../../common/helpers/login-helpers.js';
import { updateVerifyUrl } from '../../login/actions';
import { removeSavedForm } from '../actions';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';

class ProfileView extends React.Component {
  render() {
    const { profile } = this.props;
    return (
      <div>
        <div className="profile-hero" style={{ display: 'flex' }}>
          <div>
            <div style={{ background: '#ccc', height: '8em', width: '8em' }}>&nbsp;</div>
          </div>
          <div style={{ marginLeft: 25 }}>
            <h2 style={{ marginTop: 0 }}>{profile.userFullName.first} {profile.userFullName.last}</h2>
            United States Army<br/>
            First Lieutenant
          </div>
        </div>
        <h2>Contact Information</h2>
        <h3>Mailing Address</h3>
        1234 Anywhere Drive<br/>
        Anytown, MA 000000
        <h3>Residential Address</h3>
        1234 Anywhere Drive<br/>
        Anytown, MA 000000
        <h3>Primary Phone Number</h3>
        555-555-5555
        <h3>Alternate Phone Number</h3>
        555-555-5555
        <h3>Email Address</h3>
        example@example.com
        <h2>Personal Information</h2>
        <h3>Gender</h3>
        Female
        <h3>Birth date</h3>
        Jan 1, 1900
        <h3>Social security number</h3>
        xxx-xx-0000
        <h2>Military Service</h2>
        <h3>Army</h3>
        Mar 2, 2011 - Jan 12, 2016
        <h3>Air Force</h3>
        Mar 2, 2011 - Jan 12, 2016
        <h3>Service Awards</h3>
        Example Recogition
      </div>
    );
  }
}

class UserProfileApp extends React.Component {
  componentDidMount() {
    if (!this.props.verifyUrl) {
      getVerifyUrl(this.props.updateVerifyUrl);
    }
  }

  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <DowntimeNotification appTitle="user profile page" dependencies={[services.mvi, services.emis]}>
            <div className="row user-profile-row">
              <div className="usa-width-two-thirds medium-8 small-12 columns">
                <h1>Your Profile</h1>
                <ProfileView profile={this.props.profile}/>
              </div>
            </div>
          </DowntimeNotification>
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
    verifyUrl: userState.login.verifyUrl
  };
};

const mapDispatchToProps = {
  removeSavedForm,
  updateVerifyUrl
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
