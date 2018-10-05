import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import BetaEnrollmentButton from './containers/BetaEnrollmentButton';
import backendServices from '../../platform/user/profile/constants/backendServices';

function renderGatedButton(user, isEnrolling, onClick) {
  let buttonText = 'Turn On Beta Tool';

  if (
    user.login.currentlyLoggedIn &&
    !user.profile.services.includes(backendServices.CLAIM_INCREASE_AVAILABLE)
  ) {
    return (
      <AlertBox
        status="warning"
        isVisible
        content={
          <div>
            <h3>
              We’re sorry. The increased disability compensation tool is
              unavailable right now.
            </h3>
            <p>
              We can accept only a limited number of submissions a day while
              we’re in beta. Please check back again soon.
            </p>
          </div>
        }
      />
    );
  }

  if (user.profile.loading) buttonText = 'Loading Profile...';
  else if (isEnrolling) buttonText = 'Turning On Beta Tool';

  const disabled = isEnrolling || user.profile.loading;

  return (
    <button
      className="usa-button-primary"
      disabled={disabled}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}

/**
 * A helper function for creating new beta-enrollment buttons
 * @param {string} feature the name of the service to be registered into the user's services property once the button is pressed. This service must also be registered in the API.
 * @param {*} returnUrl the URL which the user will be redirected after the service is successfully saved
 */
export default function create526EnrollmentButton() {
  return () => (
    <BetaEnrollmentButton
      feature={backendServices.CLAIM_INCREASE}
      returnUrl="/disability-benefits/apply/form-526-disability-claim"
      renderButton={renderGatedButton}
    />
  );
}
