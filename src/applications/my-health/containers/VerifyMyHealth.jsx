import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

// import appendQuery from 'append-query';
import {
  logout,
  verify,
} from '../../../platform/user/authentication/utilities';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  // upgradeMHVAccount,
} from '../../../platform/user/profile/actions';

import { isLoggedIn, selectProfile } from '../../../platform/user/selectors';

class VerifyMyHealth extends React.Component {
  componentDidUpdate(prevProps) {
    const { profile } = this.props;
    if (prevProps.profile.loading && !profile.loading) {
      if (this.props.isLoggedIn) {
        this.props.fetchMHVAccount();
      } else {
        window.location = '/';
      }
    }
  }

  getContent = () => {
    const { profile, mhvAccount } = this.props;

    // LOA Checks
    if (!profile.verified) {
      return this.getVerifyContent();
    }

    // TODO: MVI Checks

    // MHV Checks
    if (mhvAccount.errors) {
      return this.getMhvErrorContent();
    }

    // const accountState = 'needs_va_patient';

    // switch (accountState) {
    //   case 'needs_identity_verification':
    //     return this.getVerifyContent();
    //   case 'needs_ssn_resolution':
    //     return this.getSSNResolutionContent();
    //   case 'has_deactivated_mhv_ids':
    //     return this.getDeactivatedMHVContent();
    //   case 'has_multiple_active_mhv_ids':
    //     return this.getMultipleMHVIdsContent();
    //   case 'register_failed':
    //     return this.getRegisterFailedContent();
    //   case 'upgrade_failed':
    //     return this.getUpgradeFailedContent();
    //   case 'needs_va_patient':
    //     return this.getNoPatientRecordContent();
    //   default: // Handle other content outside of block.
    // }

    // const { accountLevel } = this.props.mhvAccount;

    // if (!accountLevel) {
    return this.getCreateMHVAccountContent();
    // }

    // return this.getUpgradeMHVAccountContent();
  };

  getVerifyContent = () => ({
    heading: 'Verify your identity to access health tools',
    body: (
      <>
        <p>
          We take your privacy seriously, and we’re committed to protecting your
          information. You’ll need to verify your identity before we can give
          you access to your personal health information.
        </p>
        <button
          onClick={verify}
          className="usa-button-primary va-button-primary"
        >
          Verify your identity
        </button>
      </>
    ),
  });

  getMhvErrorContent = () => ({
    heading: 'Please try again later',
    alertContent: (
      <>
        <p>
          We're sorry. Something went wrong on our end, and we couldn't connect
          you to health tools.
        </p>
      </>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h3>What you can do:</h3>
        <p>Please try again later.</p>
      </>
    ),
  });

  getSSNResolutionContent = () => ({
    heading: 'Please contact us to verify your identity.',
    alertContent: (
      <div>
        <p>
          We’re sorry. We can’t match the information you provided with what we
          have in our Veteran records. We take your privacy seriously, and we’re
          committed to protecting your information. We can’t give you access to
          our online health tools until we can match your information and verify
          your identity.
        </p>
      </div>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h5>What you can do</h5>
        <p>
          To verify your identity, please call us or submit an online help
          request.
        </p>
        <ul className="usa-accordion">
          <li>
            <button
              className="usa-accordion-button"
              aria-expanded="false"
              aria-controls="a1"
            >
              Call us
            </button>
            <div id="a1" className="usa-accordion-content">
              <p>
                Please call us at{' '}
                <a href="tel:+1-800-827-1000">1-800-827-1000</a>. We’re here
                Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have
                hearing loss, call TTY: 1-800-829-4833.
              </p>
              <p>
                When the system prompts you to give a reason for your call, say,
                “eBenefits.”
              </p>
              <p>
                <strong>We’ll then ask you to tell us:</strong>
              </p>
              <ul>
                <li>
                  Your full name. Please provide the last name you used while in
                  service or that’s listed on your DD214 or other separation
                  documents, even if you’ve since changed your name.
                </li>
                <li>Your Social Security Number</li>
                <li>Your checking or savings account number</li>
                <li>
                  The dollar amount of your most recent VA electronic funds
                  transfer (EFT)
                </li>
              </ul>
            </div>
          </li>
          <li>
            <button
              className="usa-accordion-button"
              aria-expanded="false"
              aria-controls="a2"
            >
              Ask us a question online
            </button>
            <div id="a2" className="usa-accordion-content">
              <p>
                Ask us a question online through our online help center, known
                as the Inquiry Routing &amp; Information System (or IRIS).
              </p>
              <p>
                <strong>Fill in the form fields as below:</strong>
              </p>
              <ul>
                <li>
                  <strong>Question:</strong> Type in “Not in DEERS.”
                </li>
                <li>
                  <strong>Topic:</strong> Select “Veteran not in DEERS (Add)”
                </li>
                <li>
                  <strong>Inquiry type:</strong> Select “Question”
                </li>
              </ul>
              <p>
                Then, complete the rest of the form and click{' '}
                <strong>Submit</strong>
              </p>
              <p>We’ll contact you within 2 to 3 days.</p>
              <a href="https://iris.custhelp.va.gov/app/as">
                Go to the IRIS website question form
              </a>
            </div>
          </li>
        </ul>
      </>
    ),
  });

  getDeactivatedMHVContent = () => ({
    heading: 'Please contact us to reactivate your account',
    alertContent: (
      <>
        <p>
          We’re sorry. Your My HealtheVet account isn’t active at this time. To
          use our online health tools, you’ll need to call us to reactivate your
          account.
        </p>
      </>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h5>What you can do</h5>
        <p>
          Call My HealtheVet help desk or submit an online request for help.
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
                Ask us a question online through our online help center, known
                as the Inquiry Routing &amp; Information System (or IRIS).
              </p>
              <p>
                <strong>Fill in the form fields as below:</strong>
              </p>
              <ul>
                <li>
                  <strong>Question:</strong> Type in “Not in DEERS.”
                </li>
                <li>
                  <strong>Topic:</strong> Select “Veteran not in DEERS (Add)”
                </li>
                <li>
                  <strong>Inquiry type:</strong> Select “Question”
                </li>
              </ul>
              <p>
                Then, complete the rest of the form and click{' '}
                <strong>Submit</strong>
              </p>
              <p>We’ll contact you within 2 to 3 days.</p>
              <a href="https://iris.custhelp.va.gov/app/as">
                Go to the IRIS website question form
              </a>
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
                Ask us a question online through our online help center, known
                as the Inquiry Routing &amp; Information System (or IRIS).
              </p>
              <p>
                <strong>Fill in the form fields as below:</strong>
              </p>
              <ul>
                <li>
                  <strong>Question:</strong> Type in “Not in DEERS.”
                </li>
                <li>
                  <strong>Topic:</strong> Select “Veteran not in DEERS (Add)”
                </li>
                <li>
                  <strong>Inquiry type:</strong> Select “Question”
                </li>
              </ul>
              <p>
                Then, complete the rest of the form and click{' '}
                <strong>Submit</strong>
              </p>
              <p>We’ll contact you within 2 to 3 days.</p>
              <a href="https://iris.custhelp.va.gov/app/as">
                Go to the IRIS website question form
              </a>
            </div>
          </li>
        </ul>
      </>
    ),
  });

  getMultipleMHVIdsContent = () => ({
    heading: 'It looks like you have more than one My HealtheVet account',
    alertContent: (
      <>
        <p>We’re sorry. We found more than one active account for you.</p>
      </>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h5>What you can do</h5>
        <p>You can call My HealtheVet or submit an online request for help.</p>
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
                tools on VA.gov, but received an error message telling you that
                you have more than one My HealtheVet account.
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
                    received an error message telling me I have more than one
                    MyHealtheVet account.”
                  </p>
                </li>
              </ul>
              <p>
                Then, complete the rest of the form and click{' '}
                <strong>Submit</strong>
              </p>
              <a href="https://www.myhealth.va.gov/mhv-portal-web/contact-us">
                Go to the My HealtheVet contact form
              </a>{' '}
            </div>
          </li>
        </ul>
      </>
    ),
  });

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

  getNoPatientRecordContent = () => ({
    heading: 'We couldn’t match your information to our VA patient records',
    alertContent: (
      <p>
        We’re sorry. We couldn't find a match for you in our VA patient records.
      </p>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h3>What you can do:</h3>
        <div className="vads-u-padding-bottom--0p5">
          <p>
            <strong>
              If you’re currently registered as a patient at a VA health
              facility
            </strong>
          </p>
          <p>
            Call MyVA311 (<a href="tel:1-844-698-2311">844-698-2311</a>
            ), and select 3 to reach your nearest VA medical center. If you have
            hearing loss, call TTY: 711.
          </p>
          <p>
            Tell the representative that you tried to sign in to use health
            tools on VA.gov, but you received an error message telling you that
            the site couldn’t match your information to a VA patient record.
          </p>
        </div>

        <div className="vads-u-padding-bottom--0p5">
          <p>
            <strong>
              If you’re enrolled in VA health care, but not currently registered
              as a patient at a VA health facility
            </strong>
          </p>
          <p>
            Call <a href="tel:1-844-698-2311">844-698-2311</a>, and select 3 to
            reach your nearest VA medical center. If you have hearing loss, call
            TTY: 711.
          </p>
          <p>
            Tell the representative that you’re enrolled in VA health care and
            you’d like to register as a VA patient.
          </p>
        </div>

        <div className="vads-u-padding-bottom--0p5">
          <p>
            <strong>If you're not enrolled in VA health care</strong>
          </p>
          <p>
            You’ll need to apply for enrollment before you can register as a VA
            patient.
          </p>
          <a href="/health-care/how-to-apply/">
            Find out how to apply for VA health care
          </a>
        </div>
      </>
    ),
  });

  getCreateMHVAccountContent = () => ({
    heading: `Please create a My HealtheVet account to access health tools  `,
    body: (
      <>
        <p>
          You’ll need to create a My HealtheVet account before you can access
          our health tools online. This account is cost-free and secure.
        </p>
        <p>
          <strong>If you already have a My HealtheVet account,</strong> please
          sign out of VA.gov. Then sign in again with your My HealtheVet
          username and password.
        </p>

        <button
          onClick={this.props.createAndUpgradeMHVAccount}
          className="usa-button-primary va-button-primary"
        >
          Create your free account
        </button>
        <button
          className="va-button-link vads-u-margin-left--2"
          onClick={logout}
        >
          Sign out of VA.gov
        </button>
      </>
    ),
  });

  getUpgradeMHVAccountContent = () => ({
    heading: `You’ll need to upgrade your My HealtheVet account before you can ${
      this._serviceDescription
    }. It’ll only take us a minute to do this for you, and it’s free.`,
    modalStyle: 'continue',
  });

  render() {
    const { profile, mhvAccount } = this.props;

    if (profile.loading || mhvAccount.loading) {
      return (
        <div className="row">
          <div className="vads-u-padding-bottom--5">
            <LoadingIndicator />
          </div>
        </div>
      );
    }

    const content = this.getContent();

    return (
      <div className="row">
        <div className="usa-content columns medium-10 vads-u-padding-bottom--5">
          <h1>{content.heading}</h1>
          {content.alertContent && (
            <AlertBox
              content={content.alertContent}
              isVisible
              status={content.alertStatus}
            />
          )}
          {content.body}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading, mhvAccount, /* services, */ verified } = profile;
  return {
    // availableServices: new Set(services),
    isLoggedIn: isLoggedIn(state),
    profile: { loading, verified },
    mhvAccount,
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
)(VerifyMyHealth);
