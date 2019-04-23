import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  // upgradeMHVAccount,
} from '../../../platform/user/profile/actions';

import { isLoggedIn, selectProfile } from '../../../platform/user/selectors';

class ValidateMHVAccount extends React.Component {
  componentDidUpdate(prevProps) {
    const { profile, mhvAccount } = this.props;
    if (prevProps.profile.loading && !profile.loading) {
      if (this.props.isLoggedIn) {
        this.props.fetchMHVAccount();
      } else {
        window.location = '/';
      }
    }

    if (prevProps.mhvAccount.loading && !mhvAccount.loading) {
      this.redirect();
    }
  }

  getRegisterFailedContent = () => ({
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
        <h5>What you can do</h5>
        <p>
          To create an account, please call the My HealtheVet help desk or
          submit an online request for help.
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
                <a href="tel:877-327-0022">77-327-0022</a>
                8. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
                If you have hearing loss, call TTY: 800-877-3399.
              </p>
              <p>
                Tell the representative that you tried to sign in to use health
                tools on VA.gov, but received an error messaging telling you
                that we couldn't create an account for you.
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
                  <strong>Topic:</strong> Select <strong>Account Login</strong>.
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
                    received an error message telling me that the site couldn't
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
            </div>
          </li>
        </ul>
      </>
    ),
  });

  getUpgradeFailedContent = () => ({
    heading: 'Something went wrong with upgrading your account',
    alertText: (
      <div>
        <p>
          We’re sorry. Something went wrong on our end while we were trying to
          upgrade your account. You won’t be able to use VA.gov health tools
          until we can fix the problem.
        </p>
        <h5>What you can do</h5>
        <p>If you feel you’ve entered your information correctly, please</p>
      </div>
    ),
    modalStyle: 'error',
  });

  getUpgradeMHVAccountContent = () => ({
    heading: `You’ll need to upgrade your My HealtheVet account before you can ${
      this._serviceDescription
    }. It’ll only take us a minute to do this for you, and it’s free.`,
    modalStyle: 'continue',
  });

  redirect = () => {
    const { profile, mhvAccount } = this.props;

    // LOA Checks
    if (!profile.verified) {
      window.location = 'verify';
    }

    // MHV Checks
    if (this.props.mviDown || mhvAccount.errors) {
      return this.getErrorContent();
    }

    const accountState = 'needs_va_patient';

    switch (accountState) {
      case 'needs_identity_verification':
        window.location = 'verify';
        break;
      case 'has_deactivated_mhv_ids':
      case 'has_multiple_active_mhv_ids':
      case 'needs_ssn_resolution':
      case 'register_failed':
      case 'upgrade_failed':
      case 'needs_va_patient':
        window.location = `error/${accountState.replace(/_/g, '-')}`;
        break;
      default: // Handle other content outside of block.
    }

    // const { accountLevel } = this.props.mhvAccount;

    // if (!accountLevel) {
    return this.getCreateMHVAccountContent();
    // }

    // return this.getUpgradeMHVAccountContent();
  };

  render() {
    return (
      <div className="row">
        <div className="vads-u-padding-bottom--5">
          <LoadingIndicator messsage="Loading your health account information..." />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading, mhvAccount, /* services, */ status, verified } = profile;
  return {
    // availableServices: new Set(services),
    isLoggedIn: isLoggedIn(state),
    profile: { loading, verified },
    mhvAccount,
    mviDown: status === 'SERVER_ERROR',
  };
};
const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  // toggleLoginModal,
  // upgradeMHVAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateMHVAccount);
