import React from 'react';
import { useSelector } from 'react-redux';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { selectUserProfile, selectUserIsLoading } from '../selectors/user';
import { SIGN_IN_URL } from '../constants';
import LandingPageWelcome from '../components/LandingPageWelcome/LandingPageWelcome';

const LandingPage = () => {
  const profile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectUserIsLoading);

  if (isLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator
          message="Loading the Accredited Representative Portal..."
          data-testid="landing-page-loading-indicator"
        />
      </div>
    );
  }

  if (profile) {
    return <LandingPageWelcome firstName={profile.firstName} />;
  }

  return (
    <LandingPageWelcome>
      <div className="vads-l-col--12 medium-screen:vads-l-col--6 homepage-hero__container">
        <div className="vads-u-display--flex vads-u-width--full vads-u-align-items--center vars-u-justify-content--center">
          <div className="va-flex vads-u-flex-direction--column vads-u-align-items--flex-start vads-u-background-color--white vads-u-margin-top--6 vads-u-margin-bottom--6 vads-u-padding-x--3 vads-u-padding-y--2 vads-u-width--full homepage-hero__create-account">
            <h2
              className="vads-u-font-size--md vads-u-line-height--5 vads-u-color--gray vads-u-margin-top--0 vads-u-padding-right--2 vads-u-font-family--sans vads-u-font-weight--normal"
              data-testid="landing-page-create-account-text"
            >
              Create an account to start managing power of attorney.
            </h2>
            <a
              data-testid="landing-page-sign-in-link"
              className="usa-button usa-button-primary"
              href={SIGN_IN_URL}
            >
              Sign in or create account
            </a>
          </div>
        </div>
      </div>
    </LandingPageWelcome>
  );
};

export default LandingPage;
