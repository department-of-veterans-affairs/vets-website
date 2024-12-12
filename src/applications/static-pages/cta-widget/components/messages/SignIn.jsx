import React from 'react';
import PropTypes from 'prop-types';
import CallToActionAlert from '../CallToActionAlert';

const SignIn = ({
  serviceDescription,
  primaryButtonHandler,
  headerLevel,
  ariaLabel = null,
  ariaDescribedby = null,
}) => {
  const headingPrefix = 'Sign in with a verified account';
  const headline = serviceDescription
    ? `${headingPrefix} to ${serviceDescription}`
    : headingPrefix;

  const content = {
    heading: headline,
    headerLevel,
    alertText: (
      <>
        <p>
          You’ll need to sign in with an identity-verified account through one
          of our account providers. Identity verification helps us protect all
          Veterans' information and prevent scammers from stealing your
          benefits.
        </p>
        <p>
          <strong>Don’t yet have a verified account?</strong> Create a{' '}
          <strong>Login.gov</strong> or <strong>ID.me</strong> account. We’ll
          help you verify your identity for your account now.
        </p>
        <p>
          <strong>Not sure if your account is verified?</strong> Sign in here.
          If you still need to verify your identity, we’ll help you do that now.
        </p>
        <p>
          <va-button
            onClick={primaryButtonHandler}
            text="Sign in or create an account"
            label={ariaLabel}
            aria-describedby={ariaDescribedby}
            uswds
          />
        </p>
        <p>
          <va-link
            href="https://www.va.gov/resources/creating-an-account-for-vagov"
            text="Learn about creating an account"
          />
        </p>
      </>
    ),
    status: 'info',
  };

  return <CallToActionAlert {...content} />;
};

SignIn.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
  serviceDescription: PropTypes.string.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  headerLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SignIn;
