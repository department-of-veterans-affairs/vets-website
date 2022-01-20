import React from 'react';

import ErrorMessage from '../../components/ErrorMessage';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

import { useSessionStorage } from '../../hooks/useSessionStorage';

const Error = () => {
  const { getValidateAttempts } = useSessionStorage(false);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const maxValidateMessage =
    "We're sorry. We couldn't match your information to our records. Please try again or call us at 800-698-2411 (TTY: 711) for help signing in.";
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      {isMaxValidateAttempts ? (
        <ErrorMessage message={maxValidateMessage} />
      ) : (
        <ErrorMessage />
      )}
      <Footer />
      <BackToHome />
    </div>
  );
};

export default Error;
