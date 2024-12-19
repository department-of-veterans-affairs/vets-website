import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthenticatedVerify from '../components/AuthenticatedVerify';
import UnauthenticatedVerify from '../components/UnauthenticatedVerify';

export default function VerifyApp() {
  const isAuthenticated = localStorage.getItem('hasSession');

  useEffect(() => {
    document.title = `Verify your identity`; // title should match h1 tag
  }, []);

  return (
    <>
      {!isAuthenticated ? <UnauthenticatedVerify /> : <AuthenticatedVerify />}
    </>
  );
}

VerifyApp.propTypes = {
  env: PropTypes.object,
};
