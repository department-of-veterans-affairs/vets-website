import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser, isLOA3 } from 'platform/user/selectors';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { fetchMHVAccount } from 'platform/user/profile/actions';

function Redirect() {
  useEffect(() => {
    window.location.replace('/profile/account-security');
  }, []);

  return null;
}

function AccountApp(props) {
  return (
    <div>
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={props.user}
      >
        <Redirect />
      </RequiredLoginView>
    </div>
  );
}

const mapStateToProps = state => {
  const userState = selectUser(state);

  return {
    isLOA3: isLOA3(state),
    login: userState.login,
    profile: userState.profile,
    user: userState,
  };
};

const mapDispatchToProps = {
  fetchMHVAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountApp);
export { AccountApp };
