import React from 'react';
import PropTypes from 'prop-types';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import CallToActionAlert from '../CallToActionAlert';

const UpgradeFailed = ({ upgradeMHVAccount }) => {
  const content = {
    heading: 'We couldn’t upgrade your My HealtheVet account',
    alertText: (
      <>
        <p>
          We’re sorry. Something went wrong on our end while we were trying to
          upgrade your account. You won’t be able to use VA.gov health tools
          until we can fix the problem.
        </p>
        <h5>What you can do</h5>
        <p className="vads-u-margin-top--0">Please try again.</p>
        <button className="usa-button-primary" onClick={upgradeMHVAccount}>
          Try again to upgrade your account
        </button>
        <p>
          <strong>
            If you try again and continue to see this error, you can upgrade
            your My HealtheVet account in one of these ways:
          </strong>
        </p>
        <AdditionalInfo triggerText="Call the My HealtheVet help desk">
          <p>
            Call us at <a href="tel:877-327-0022">877-327-0022</a>. We're here
            Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have
            hearing loss, call TTY: <Telephone contact={CONTACTS.HELP_TTY} />.
          </p>
          <p>
            Tell the representative that you tried to sign in to use the online
            health tools on VA.gov, but received an error messaging telling you
            that we couldn't create an account for you.
          </p>
        </AdditionalInfo>
        <div className="vads-u-margin-top--1p5">
          <AdditionalInfo triggerText="Or submit an online help request to My HealtheVet">
            <p>
              Use the My HealtheVet contact form to submit an online request for
              help.
            </p>
            <p>
              <strong>Fill in the form fields as below:</strong>
            </p>
            <ul>
              <li>
                <strong>Topic: </strong>
                Select <strong>Account Login</strong>.
              </li>
              <li>
                <strong>Category: </strong>
                Select <strong>Request for Assistance</strong>.
              </li>
              <li>
                <strong>Comments: </strong> Type, or copy and paste, the message
                below:
                <p>
                  “When I tried to sign in to use the health tools on VA.gov, I
                  received an error message telling me that the site couldn't
                  create a My HealtheVet account for me.”
                </p>
              </li>
            </ul>
            <p>
              Then, complete the rest of the form and click{' '}
              <strong>Submit</strong>.
            </p>
            <p>
              <a
                href="https://www.myhealth.va.gov/mhv-portal-web/contact-us"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to the My HealtheVet contact form
              </a>
            </p>
          </AdditionalInfo>
        </div>
      </>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

UpgradeFailed.propTypes = {
  upgradeMHVAccount: PropTypes.func.isRequired,
};

export default UpgradeFailed;
