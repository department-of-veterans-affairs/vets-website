import React from 'react';
import BackToHome from '../components/BackToHome';

const Error = () => {
  return (
    <>
      <div>The current session was lost, try the original link again.</div>
      <BackToHome />
    </>
  );
};

export default Error;
