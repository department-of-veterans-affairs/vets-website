import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MessageTemplate from '../components/MessageTemplate';

import { createAndUpgradeMHVAccount } from '../../../platform/user/profile/actions';

class CreateMHVAccountFailed extends React.Component {
  render() {
    const content = {
      heading: 'We couldn’t create a My HealtheVet account for you',
      alertContent: (
        <div>
          <p>
            We’re sorry. Something went wrong on our end, and we couldn’t create
            a My HealtheVet account for you. You’ll need a My HealtheVet account
            to access health tools on VA.gov.
          </p>
        </div>
      ),
      alertStatus: 'error',
      body: (
        <>
          <h4>What you can do</h4>
          <p>Please try again.</p>
          <button onClick={this.props.createAndUpgradeMHVAccount}>
            Try again to create your account
          </button>
          <p>
            <strong>
              If you try again and continue to see this error, you can upgrade
              your account in one of these ways:
            </strong>
          </p>
          <ul className="usa-accordion">
            <li>
              <button
                className="usa-accordion-button"
                aria-expanded="false"
                aria-controls="a1"
              >
                Call the My HealtheVet help desk
              </button>
              <div id="a1" className="usa-accordion-content">
                <p>
                  Call the My HealtheVet help desk at{' '}
                  <a href="tel:877-327-0022">877-327-0022</a>
                  8. We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.
                  ET. If you have hearing loss, call TTY: 800-877-3399.
                </p>
                <p>
                  Tell the representative that you tried to sign in to use
                  health tools on VA.gov, but received an error message telling
                  you that we couldn’t create an account for you.
                </p>
              </div>
            </li>
            <li>
              <button
                className="usa-accordion-button"
                aria-expanded="false"
                aria-controls="a2"
              >
                Submit an online help request to My HealtheVet
              </button>
              <div id="a2" className="usa-accordion-content">
                <p>
                  Use the My HealtheVet contact form to submit an online request
                  for help.
                </p>
                <p>
                  <strong>Fill in the form fields as below:</strong>
                </p>
                <ul>
                  <li>
                    <strong>Topic:</strong> Select{' '}
                    <strong>Account Login</strong>.
                  </li>
                  <li>
                    <strong>Category:</strong> Select{' '}
                    <strong>Request for Assistance</strong>.
                  </li>
                  <li>
                    <strong>Comments:</strong> Type, or copy and paste, in the
                    message below:
                    <p>
                      “When I tried to sign in to use health tools on VA.gov, I
                      received an error message telling me that the site
                      couldn't create a My HealtheVet account for me.”
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
              </div>
            </li>
          </ul>
        </>
      ),
    };

    return <MessageTemplate content={content} />;
  }
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
