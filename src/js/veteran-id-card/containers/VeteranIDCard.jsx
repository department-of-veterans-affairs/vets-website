import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredVeteranView from '../components/RequiredVeteranView';
import EmailCapture from './EmailCapture';

class VeteranIDCard extends React.Component {

  componentDidMount() {
    if (!this.props.profile.accountType) {
      window.dataLayer.push({ event: 'vic-unauthenticated' });
    }
  }

  render() {
    // direct all unauthenticated users to email form
    if (!this.props.profile.accountType) {
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
  };
};

export default connect(mapStateToProps)(VeteranIDCard);
export { VeteranIDCard };
