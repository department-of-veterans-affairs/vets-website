import React from 'react';

import ErrorMessage from '../../components/ErrorMessage';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';

const Error = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <ErrorMessage />
      <Footer />
      <BackToHome />
    </div>
  );
};

export default Error;
