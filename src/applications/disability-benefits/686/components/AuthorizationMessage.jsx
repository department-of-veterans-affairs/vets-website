import SystemDownView from '@department-of-veterans-affairs/formation/SystemDownView';
import React from 'react';
import appendQuery from 'append-query';
import PropTypes from 'prop-types';

import manifest from '../../526EZ/manifest.json';

const { rootUrl: increaseRootUrl } = manifest;
import { profileStatuses } from '../helpers';

const { SERVER_ERROR, NOT_FOUND } = profileStatuses;
const nextQuery = { next: window.location.pathname };
const signInUrl = appendQuery('/', nextQuery);
const verifyUrl = appendQuery('/verify', nextQuery);

export default class AuthorizationMessage extends React.Component {
  redirectToAuthentication = () => {
    if (!this.props.user.isLoggedIn) window.location.replace(signInUrl);
    else if (!this.props.user.isVerified) window.location.replace(verifyUrl);
  };

  // eslint-disable-next-line consistent-return
  render() {
    const {
      has30PercentDisabilityRating,
      user: { profileStatus, isLoggedIn, isVerified },
    } = this.props;
    if (profileStatus === SERVER_ERROR) {
      // If va_profile is null, show a system down message.
      return (
        <SystemDownView messageLine1="Sorry, our system is temporarily down while we fix a few things. Please try again later." />
      );
    }
    if (profileStatus === NOT_FOUND) {
      // If va_profile is "not found", show message that we cannot find the user in our system.
      return (
        <SystemDownView
          messageLine1="We couldn’t find your records with that information."
          messageLine2="Please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We're open Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)."
        />
      );
    }
    if (!isLoggedIn || !isVerified) {
      return (
        <div>
          <h5>We couldn’t verify your identity</h5>
          <p>
            Please try again. If you have a premium DS Logon or My HealtheVet
            account, you can try signing in that way, or you can create an ID.me
            account to complete the verification process.
          </p>
          <button
            className="usa-button-primary"
            onClick={this.redirectToAuthentication}
          >
            Verify your Account
          </button>
        </div>
      );
    }
    if (!has30PercentDisabilityRating) {
      return (
        <div>
          <h5>You won’t be able to add a dependent at this time</h5>
          <p>
            We’re sorry. You need to have a disability rating of at least 30% to
            add a dependent to your benefits. Our records show that your current
            rating is less than 30%, so you can’t apply at this time. If you
            think our records aren’t correct, please call Veterans Benefits
            Assistance at 1-800-827-1000. We’re here Monday – Friday, 8:00 a.m.
            to 9:00 p.m. (ET).
          </p>
          <a className="usa-button-primary" href={increaseRootUrl}>
            Start a Claim for Increase Application
          </a>
        </div>
      );
    }
  }
}

AuthorizationMessage.propTypes = {
  has30PercentDisabilityRating: PropTypes.bool,
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    isVerified: PropTypes.bool,
    profileStatus: PropTypes.string,
  }),
};
