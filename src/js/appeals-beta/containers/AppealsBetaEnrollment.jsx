import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';

class AppealsBetaEnrollment extends React.Component {

  render() {
    return (
      <div>
        <RequiredLoginView
            authRequired={1}
            serviceRequired={"user-profile"}
            userProfile={this.props.profile}
            loginUrl={this.props.loginUrl}
            verifyUrl={this.props.verifyUrl}>
          {this.props.children}
        </RequiredLoginView>
      </div>
      );
  }
}

const mapStateToProps = (state) => {
  const abState = state.appealsBeta;
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl,
    username: abState.beta.username,
    stats: abState.beta.stats,
    isLoading: abState.beta.loading,
  };
};

export default connect(mapStateToProps)(AppealsBetaEnrollment);
export { AppealsBetaEnrollment };
