import React from 'react';

import ErrorMessage from '../../components/ErrorMessage';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';

import { useSessionStorage } from '../../hooks/useSessionStorage';

const Error = () => {
  const { getValidateAttempts } = useSessionStorage(false);
  const { isMaxValidateAttempts } = getValidateAttempts(window);
  const maxValidateMessage =
    "We're sorry. We couldn't match your information to our records. Please ask a staff member for help.";
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
