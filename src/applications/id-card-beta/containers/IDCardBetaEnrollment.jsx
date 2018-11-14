import React from 'react';
import { connect } from 'react-redux';

import backendServices from '../../../platform/user/profile/constants/backendServices';
import RequiredLoginView from '../../../platform/user/authorization/components/RequiredLoginView';

class IDCardBetaEnrollment extends React.Component {
  render() {
    return (
      <div>
        <RequiredLoginView
          serviceRequired={backendServices.USER_PROFILE}
          user={this.props.user}
        >
          {this.props.children}
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(IDCardBetaEnrollment);
export { IDCardBetaEnrollment };
