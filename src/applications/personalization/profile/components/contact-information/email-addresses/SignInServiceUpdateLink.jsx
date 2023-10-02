import React from 'react';
import { useSignInServiceProvider } from '../../../hooks';

const SignInServiceUpdateLink = () => {
  const { link, label } = useSignInServiceProvider();

  return (
    <>
      <p className="vads-u-margin--0">
        To view or update your sign in information, go to the website where you
        manage your account information. Any updates you make there will
        automatically update on VA.gov.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Update sign-in information on {label}
        </a>
      </p>
    </>
  );
};

export default SignInServiceUpdateLink;
