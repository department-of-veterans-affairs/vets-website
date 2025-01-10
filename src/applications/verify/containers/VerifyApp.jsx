import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Verify from '../components/UnifiedVerify';

export default function VerifyApp() {
  useEffect(() => {
    document.title = `Verify your identity`; // Set the document title
  }, []);

  return (
    <>
      <Verify />
    </>
  );
}

VerifyApp.propTypes = {
  env: PropTypes.object,
};
