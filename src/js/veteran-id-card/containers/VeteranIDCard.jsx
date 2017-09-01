import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';

class VeteranIDCard extends React.Component {

  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
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
  const idState = state.idcard;
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl,
    redirect: idState.idcard.redirect,
    isLoading: idState.idcard.loading,
    errors: idState.idcard.errors,
  };
};

export default connect(mapStateToProps)(VeteranIDCard);
export { VeteranIDCard };
