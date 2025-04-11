import React from 'react';
import LoginActions from 'platform/user/authentication/components/LoginActions';
import '../sass/login.scss';

const LoginContainer = () => {
  return (
    <>
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 vads-u-padding-y--5">
            <h1>Sign in to the Accredited Representative Portal</h1>
            <LoginActions externalApplication="arp" OAuth />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginContainer;
