import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CollapsiblePanel from '@department-of-veterans-affairs/component-library/CollapsiblePanel';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import MessageTemplate from '../components/MessageTemplate';
import { createAndUpgradeMHVAccount } from 'platform/user/profile/actions';

function CreateMHVAccountFailed(props) {
  const content = {
    heading: 'We couldn’t create a My HealtheVet account for you',
    alertContent: (
      <div>
        <p>
          We’re sorry. Something went wrong on our end, and we couldn’t create a
          My HealtheVet account for you. You’ll need a My HealtheVet account to
          access health tools on VA.gov.
        </p>
      </div>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h4>What you can do</h4>
        <p>Please try again.</p>
        <button onClick={props.createAndUpgradeMHVAccount}>
          Try again to create your account
        </button>
        <p>
          <strong>
            If you try again and continue to see this error, you can upgrade
            your account in one of these ways:
          </strong>
        </p>
        <CollapsiblePanel
          panelName="Call the My HealtheVet help desk"
          borderless
        >
          <p>
            Call the My HealtheVet help desk at{' '}
            <a href="tel:877-327-0022">877-327-0022</a>. We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m. ET. If you have hearing loss,
            call TTY: <Telephone contact={CONTACTS.HELP_TTY} />.
          </p>
          <p>
            Tell the representative that you tried to sign in to use health
            tools on VA.gov, but received an error message telling you that we
            couldn’t create an account for you.
          </p>
        </CollapsiblePanel>

        <CollapsiblePanel
          panelName="Submit an online help request to My HealtheVet"
          borderless
        >
          <p>
            Use the My HealtheVet contact form to submit an online request for
            help.
          </p>
          <p>
            <strong>Fill in the form fields as below:</strong>
          </p>
          <ul>
            <li>
              <strong>Topic:</strong> Select <strong>Account Login</strong>.
            </li>
            <li>
              <strong>Category:</strong> Select{' '}
              <strong>Request for Assistance</strong>.
            </li>
            <li>
              <strong>Comments:</strong> Type, or copy and paste, in the message
              below:
              <p>
                “When I tried to sign in to use health tools on VA.gov, I
                received an error message telling me that the site couldn’t
                create a My HealtheVet account for me.”
              </p>
            </li>
          </ul>
          <p>
            Then, complete the rest of the form and click{' '}
            <strong>Submit</strong>
          </p>
          <a href="https://www.myhealth.va.gov/mhv-portal-web/contact-us">
            Go to the My HealtheVet contact form
          </a>
        </CollapsiblePanel>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
}

CreateMHVAccountFailed.propTypes = {
  createAndUpgradeMHVAccount: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
};

export default connect(
  null,
  mapDispatchToProps,
)(CreateMHVAccountFailed);
