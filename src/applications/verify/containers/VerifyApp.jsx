import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import UnauthenticatedVerify from '../components/UnauthenticatedVerify';

export default function VerifyApp() {
  useEffect(() => {
    document.title = `Verify your identity`; // Set the document title
  }, []);

  return (
    <>
      <UnauthenticatedVerify />
    </>
  );
}

VerifyApp.propTypes = {
  env: PropTypes.object,
};
