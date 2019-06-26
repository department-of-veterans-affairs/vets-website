import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { logout, verify, mfa } from 'platform/user/authentication/utilities';
import recordEvent from 'platform/monitoring/record-event';
import {
  ACCOUNT_STATES,
  ACCOUNT_STATES_SET,
} from 'applications/validate-mhv-account/constants';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  upgradeMHVAccount,
} from 'platform/user/profile/actions';

import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import titleCase from 'platform/utilities/data/titleCase';

import CallToActionAlert from './CallToActionAlert';

import {
  frontendApps,
  hasRequiredMhvAccount,
  isHealthTool,
  mhvToolName,
  requiredServices,
  serviceDescription,
  toolUrl,
} from './helpers';

export class CallToActionWidget extends React.Component {
  constructor(props) {
    super(props);
    const { appId, index } = props;
    const { url, redirect } = toolUrl(appId, index);

    this._hasRedirect = redirect;
    this._isHealthTool = isHealthTool(appId);
    this._popup = null;
    this._requiredServices = requiredServices(appId);
    this._serviceDescription = serviceDescription(appId, index);
    this._mhvToolName = mhvToolName(appId);
    this._toolUrl = url;
    this._gaPrefix = 'register-mhv';
  }

  componentDidMount() {
    if (this._isHealthTool && this.props.isLoggedIn) {
      this.props.fetchMHVAccount();
    }
  }

  componentDidUpdate() {
    if (!this.props.isLoggedIn) return;

    if (this.isAccessible()) {
      if (this._hasRedirect && !this._popup) this.goToTool();
    } else if (this._isHealthTool) {
      const { accountLevel, accountState, loading } = this.props.mhvAccount;

      if (loading) return;

      if (!accountState) {
        this.props.fetchMHVAccount();
      } else if (
        new URLSearchParams(window.location.search).get('tc_accepted')
      ) {
        // Since T&C is still required to support the existing account states,
        // check the existence of a query param that gets appended after
        // successful T&C acceptance to complete account creation or upgrade.
        if (!accountLevel && accountState !== 'register_failed') {
          this.props.createAndUpgradeMHVAccount();
        } else if (accountLevel && accountState !== 'upgrade_failed') {
          this.props.upgradeMHVAccount();
        }
      }
    }
  }

  getContent = () => {
    if (!this.props.isLoggedIn) {
      return {
        heading: `Please sign in to ${this._serviceDescription}`,
        alertText: (
          <p>
            Try signing in with your <b>DS Logon</b>, <b>My HealtheVet</b>, or{' '}
            <b>ID.me</b> account. If you don’t have any of those accounts, you{' '}
            can create one.
          </p>
        ),
        primaryButtonText: 'Sign in or create an account',
        primaryButtonHandler: this.openLoginModal,
        status: 'continue',
      };
    }

    if (this._isHealthTool) return this.getHealthToolContent();

    if (!this.props.profile.verified) {
      recordEvent({
        event: `${this._gaPrefix}-info-needs-identity-verification`,
      });
      return {
        heading: `Please verify your identity to ${this._serviceDescription}`,
        alertText: (
          <p>
            We take your privacy seriously, and we’re committed to protecting
            your information. You’ll need to verify your identity before we can
            give you access to your personal health information.
          </p>
        ),
        primaryButtonText: 'Verify your identity',
        primaryButtonHandler: verify,
        status: 'continue',
      };
    }

    return null;
  };

  getHealthToolContent = () => {
    const mviMhvDownContent = {
      heading: 'We couldn’t connect you to our health tools',
      alertText: (
        <>
          <p>
            We're sorry. Something went wrong on our end, and we couldn't
            connect you to our health tools.
          </p>

          <h5>What you can do</h5>
          <p className="vads-u-margin-top--0">Please try again later.</p>
        </>
      ),
      status: 'error',
    };

    if (true) {
      recordEvent({ event: `${this._gaPrefix}-error-mvi-down` });
      return mviMhvDownContent;
    }

    if (this.isAccessible()) {
      return {
        heading: 'My HealtheVet will open in a new tab',
        alertText: (
          <p>
            You may need to sign in again on My HealtheVet before you can use
            the site’s {this._mhvToolName} tool. If you do, please sign in with
            the same account you used to sign in here on VA.gov. You also may
            need to disable your browser’s pop-up blocker so that My HealtheVet
            will be able to open.
          </p>
        ),
        primaryButtonText: 'Go to My HealtheVet',
        primaryButtonHandler: this.goToTool,
        status: 'info',
      };
    }

    if (this.props.mhvAccount.errors) {
      recordEvent({ event: `${this._gaPrefix}-error-mhv-down` });
      return mviMhvDownContent;
    }

    if (
      this.props.profile.verified &&
      this.props.appId === frontendApps.DIRECT_DEPOSIT
    ) {
      if (!this.props.profile.multifactor) {
        return {
          heading: `Please set up 2-factor authentication to ${
            this._serviceDescription
          }`,
          alertText: (
            <p>
              We’re committed to protecting your information and preventing
              fraud. You’ll need to add an extra layer of security to your
              account with 2-factor authentication before we can give you access
              to your bank account information.
            </p>
          ),
          primaryButtonText: 'Set up 2-factor authentication',
          primaryButtonHandler: mfa,
          status: 'continue',
        };
      }

      return {
        heading: `Go to your VA.gov profile to ${this._serviceDescription}`,
        alertText: (
          <p>
            Here, you can edit your bank name as well as your account number and
            type.
          </p>
        ),
        primaryButtonText: 'Go to your profile',
        primaryButtonHandler: this.goToTool,
        status: 'continue',
      };
    }

    return this.getInaccessibleHealthToolContent();
  };

  getInaccessibleHealthToolContent = () => {
    const { accountState } = this.props.mhvAccount;

    // If valid account error state, record GA event
    if (accountState && ACCOUNT_STATES_SET.has(accountState)) {
      recordEvent({
        event: `${this._gaPrefix}-${
          accountState === ACCOUNT_STATES.NEEDS_VERIFICATION ||
          accountState === ACCOUNT_STATES.NEEDS_TERMS_ACCEPTANCE
            ? 'info'
            : 'error'
        }-${accountState.replace(/_/g, '-')}`,
      });
    }

    switch (accountState) {
      case ACCOUNT_STATES.NEEDS_VERIFICATION:
        return {
          heading: `Please verify your identity to ${this._serviceDescription}`,
          alertText: (
            <p>
              We take your privacy seriously, and we’re committed to protecting
              your information. You’ll need to verify your identity before we
              can give you access to your personal health information.
            </p>
          ),
          primaryButtonText: 'Verify your identity',
          primaryButtonHandler: verify,
          status: 'continue',
        };

      case ACCOUNT_STATES.NEEDS_SSN_RESOLUTION:
        return {
          heading: 'The information you provided doesn’t match our records',
          alertText: (
            <div>
              <p>
                We’re sorry. We couldn’t match the information you provided with
                what we have in our Veteran records. We take your privacy
                seriously, and we’re committed to protecting your information.
                We can’t give you access to our online health tools until we can
                match your information and verify your identity.
              </p>
              <p>
                <strong>
                  We can help to try to match your information to our records
                  and verify your identity:
                </strong>
              </p>
              <AdditionalInfo triggerText="Call the VA benefits hotline">
                <p>
                  Please call us at <a href="tel:800-827-1000">800-827-1000</a>.
                  We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
                  If you have hearing loss, call TTY: 800-829-4833.
                </p>
                <p>
                  When the system prompts you to give a reason for your call,
                  say, “eBenefits”.
                </p>
                <p>
                  <strong>We’ll then ask you to tell us:</strong>
                </p>
                <ul>
                  <li>
                    Your full name. Please provide the last name you used while
                    in service or that’s listed on your DD214 or other
                    separation documents, even if you’ve since changed your
                    name.
                  </li>
                  <li>Your Social Security number</li>
                  <li>Your checking or savings account number</li>
                  <li>
                    The dollar amount of your most recent VA electronic funds
                    transfer (EFT)
                  </li>
                </ul>
              </AdditionalInfo>
              <div className="vads-u-margin-top--1p5">
                <AdditionalInfo triggerText="Or ask us a question online">
                  <p>
                    Ask us a question through our online help center, known as
                    the Inquiry Routing & Information System (IRIS).
                  </p>
                  <p>
                    <strong>Fill in the form fields as below:</strong>
                  </p>
                  <ul>
                    <li>
                      <strong>Question: </strong>
                      Type in <strong>Not in DEERS</strong>.
                    </li>
                    <li>
                      <strong>Topic: </strong>
                      Select <strong>Veteran not in DEERS (Add)</strong>.
                    </li>
                    <li>
                      <strong>Inquiry type: </strong> Select{' '}
                      <strong>Question</strong>.
                    </li>
                  </ul>
                  <p>
                    Then, complete the rest of the form and click{' '}
                    <strong>Submit</strong>.
                  </p>
                  <p>We’ll contact you within 2 to 3 days.</p>
                  <p>
                    <a
                      href="https://iris.custhelp.va.gov/app/ask"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Go to the IRIS website question form
                    </a>
                  </p>
                </AdditionalInfo>
              </div>
            </div>
          ),
          status: 'error',
        };
      case ACCOUNT_STATES.DEACTIVATED_MHV_IDS:
        return {
          heading: 'Your My HealtheVet account is inactive',
          alertText: (
            <div>
              <p>
                We’re sorry. Your My HealtheVet account isn’t active at this
                time. To use our online health tools, you’ll need to contact us
                to reactivate your account.
              </p>
              <p>
                <strong>
                  You can reactivate your account in one of these ways:
                </strong>
              </p>
              <AdditionalInfo triggerText="Call the My HealtheVet help desk">
                <p>
                  Call us at <a href="tel:877-327-0022">877-327-0022</a>. We’re
                  here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. If you
                  have hearing loss, call TTY: 800-877-3399.
                </p>
                <p>
                  Tell the representative that you tried to sign in to use the
                  health tools on VA.gov, but received an error message telling
                  you that your My HealtheVet account isn’t active.
                </p>
              </AdditionalInfo>
              <div className="vads-u-margin-top--1p5">
                <AdditionalInfo triggerText="Or submit an online help request to My HealtheVet">
                  <p>
                    Use the My HealtheVet contact form to submit an online
                    request for help online.
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
                      <strong>Comments: </strong> Type, or copy and paste, the
                      message below:
                      <p>
                        “When I tried to sign in to use the health tools on
                        VA.gov, I received an error message telling me that my
                        My HealtheVet account isn’t active.”
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
            </div>
          ),
          status: 'error',
        };

      case ACCOUNT_STATES.MULTIPLE_IDS:
        return {
          heading: 'It looks like you have more than one My HealtheVet account',
          alertText: (
            <div>
              <p>We’re sorry. We found more than one active account for you.</p>
              <p>
                <strong>You can fix this issue in one of these ways: </strong>
              </p>
              <AdditionalInfo triggerText="Call the My HealtheVet help desk">
                <p>
                  Call us at <a href="tel:877-327-0022">877-327-0022</a>. We’re
                  here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. If you
                  have hearing loss, call TTY: 800-877-3399.
                </p>
                <p>
                  Tell the representative that you tried to sign in to use the
                  health tools on VA.gov, but received an error message telling
                  you that you have more than one My HealtheVet account.
                </p>
              </AdditionalInfo>
              <div className="vads-u-margin-top--1p5">
                <AdditionalInfo triggerText="Or submit an online help request to My HealtheVet">
                  <p>
                    Use the My HealtheVet contact form to submit an online
                    request for help online.
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
                      <strong>Comments: </strong> Type, or copy and paste, the
                      message below:
                      <p>
                        “When I tried to sign in to use the health tools on
                        VA.gov, I received an error message telling me I have
                        more than one MyHealtheVet account.”
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
            </div>
          ),
          status: 'error',
        };

      /* Handling for these states to be re-introduced after brand consolidation
       * when VA patient and T&C acceptance checks will no longer gate access, so
       * access to these tools will be accurately reported by the services list.
       * For now, MHV account level requirements will be validated client-side.
       *
       * case 'no_account':
       *   return {
       *     heading: `You’ll need to create a My HealtheVet account before you can ${this._serviceDescription`,
       *     primaryButtonText: 'Create a My HealtheVet Account',
       *     primaryButtonHandler: this.props.createAndUpgradeMHVAccount,
       *     status: 'continue'
       *   };

       * case 'existing':
       * case 'registered':
       *   return {
       *     heading: `You’ll need to upgrade your account before you can ${this._serviceDescription}`,
       *     primaryButtonText: 'Upgrade Your Account',
       *     primaryButtonHandler: this.props.upgradeMHVAccount,
       *     status: 'continue'
       *   };
       */

      case ACCOUNT_STATES.REGISTER_FAILED:
        return {
          heading: 'We couldn’t create a MyHealtheVet account for you',
          alertText: (
            <>
              <p>
                We’re sorry. We couldn’t create a My HealtheVet account for you.
                To use our online health tools, you’ll need to create an
                account.
              </p>
              <h5>What you can do</h5>
              <p className="vads-u-margin-top--0">Please try again.</p>
              <button
                className="usa-button-primary"
                onClick={this.props.createAndUpgradeMHVAccount}
              >
                Try again to create your account
              </button>
              <p>
                <strong>
                  If you try again and continue to see this error, you can
                  create a My HealtheVet account in one of these ways:
                </strong>
              </p>
              <AdditionalInfo triggerText="Call the My HealtheVet help desk">
                <p>
                  Call us at <a href="tel:877-327-0022">877-327-0022</a>. We're
                  here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. If you
                  have hearing loss, call TTY: 800-877-3399.
                </p>
                <p>
                  Tell the representative that you tried to sign in to use the
                  online health tools on VA.gov, but received an error messaging
                  telling you that we couldn't create an account for you.
                </p>
              </AdditionalInfo>
              <div className="vads-u-margin-top--1p5">
                <AdditionalInfo triggerText="Or submit an online help request to My HealtheVet">
                  <p>
                    Use the My HealtheVet contact form to submit an online
                    request for help.
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
                      <strong>Comments: </strong> Type, or copy and paste, the
                      message below:
                      <p>
                        “When I tried to sign in to use the health tools on
                        VA.gov, I received an error message telling me that the
                        site couldn't create a My HealtheVet account for me.”
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

      case ACCOUNT_STATES.UPGRADE_FAILED:
        return {
          heading: 'We couldn’t upgrade your My HealtheVet account',
          alertText: (
            <>
              <p>
                We’re sorry. Something went wrong on our end while we were
                trying to upgrade your account. You won’t be able to use VA.gov
                health tools until we can fix the problem.
              </p>
              <h5>What you can do</h5>
              <p className="vads-u-margin-top--0">Please try again.</p>
              <button
                className="usa-button-primary"
                onClick={this.props.upgradeMHVAccount}
              >
                Try again to upgrade your account
              </button>
              <p>
                <strong>
                  If you try again and continue to see this error, you can
                  upgrade your My HealtheVet account in one of these ways:
                </strong>
              </p>
              <AdditionalInfo triggerText="Call the My HealtheVet help desk">
                <p>
                  Call us at <a href="tel:877-327-0022">877-327-0022</a>. We're
                  here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. If you
                  have hearing loss, call TTY: 800-877-3399.
                </p>
                <p>
                  Tell the representative that you tried to sign in to use the
                  online health tools on VA.gov, but received an error messaging
                  telling you that we couldn't create an account for you.
                </p>
              </AdditionalInfo>
              <div className="vads-u-margin-top--1p5">
                <AdditionalInfo triggerText="Or submit an online help request to My HealtheVet">
                  <p>
                    Use the My HealtheVet contact form to submit an online
                    request for help.
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
                      <strong>Comments: </strong> Type, or copy and paste, the
                      message below:
                      <p>
                        “When I tried to sign in to use the health tools on
                        VA.gov, I received an error message telling me that the
                        site couldn't create a My HealtheVet account for me.”
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

      case ACCOUNT_STATES.NEEDS_VA_PATIENT:
        return {
          heading:
            'We couldn’t match your information to our VA patient records',
          alertText: (
            <>
              <p>
                We’re sorry. We couldn’t find a match for you in our VA patient
                records.
              </p>
              <h5>What you can do</h5>
              <p>
                <strong>
                  If you’re currently registered as a patient at a VA health
                  facility
                </strong>
              </p>
              <p>
                Call MyVA311 (<a href="tel:844-698-2311">844-698-2311</a>
                ), and select 3 to reach your nearest VA medical center. If you
                have hearing loss, call TTY: 711.
              </p>
              <p>
                Tell the representative that you tried to sign in to use the
                health tools on VA.gov, but you received an error message
                telling you that the site couldn’t match your information to a
                VA patient record.
              </p>
              <p>
                <strong>
                  If you’re enrolled in VA health care, but not currently
                  registered as a patient at a VA health facility
                </strong>
              </p>
              <p>
                Call <a href="tel:844-698-2311">844-698-2311</a>, and select 3
                to reach your nearest VA medical center. If you have hearing
                loss, call TTY: 711.
              </p>
              <p>
                Tell the representative that you’re enrolled in VA health care
                and you’d like to register as a VA patient.
              </p>
              <p>
                <strong>If you’re not enrolled in VA health care</strong>
              </p>
              <p>
                You’ll need to apply for VA health care before you can register
                as a VA patient.
              </p>
              <p>
                <a href="/health-care/how-to-apply/">
                  Find out how to apply for VA health care
                </a>
              </p>
            </>
          ),
          status: 'error',
        };

      default: // Handle other content outside of block.
    }

    // If account creation or upgrade isn't blocked by any of the errors we
    // handle, show either create or upgrade CTA based on MHV account level.

    const { accountLevel } = this.props.mhvAccount;

    const redirectToTermsAndConditions = () => {
      const redirectQuery = { tc_redirect: window.location.pathname }; // eslint-disable-line camelcase
      const termsConditionsUrl = appendQuery(
        '/health-care/medical-information-terms-conditions/',
        redirectQuery,
      );
      window.location = termsConditionsUrl;
    };

    if (!accountLevel) {
      return {
        heading: `Please create a My HealtheVet account to ${
          this._serviceDescription
        }`,
        alertText: (
          <>
            <p>
              You’ll need to create a My HealtheVet account before you can{' '}
              {this._serviceDescription}
              {this._serviceDescription.endsWith('online')
                ? '.'
                : ' online.'}{' '}
              This account is cost-free and secure.
            </p>
            <p>
              <strong>If you already have a My HealtheVet account,</strong>{' '}
              please sign out of VA.gov. Then sign in again with your My{' '}
              HealtheVet username and password.
            </p>
          </>
        ),
        primaryButtonText: 'Create your free account',
        primaryButtonHandler:
          accountState === 'needs_terms_acceptance'
            ? redirectToTermsAndConditions
            : this.props.createAndUpgradeMHVAccount,
        secondaryButtonText: 'Sign out of VA.gov',
        secondaryButtonHandler: this.signOut,
        status: 'continue',
      };
    }

    return {
      heading: `You’ll need to upgrade your My HealtheVet account before you can ${
        this._serviceDescription
      }. It’ll only take us a minute to do this for you, and it’s free.`,
      primaryButtonText: 'Upgrade Your My HealtheVet Account',
      primaryButtonHandler:
        accountState === 'needs_terms_acceptance'
          ? redirectToTermsAndConditions
          : this.props.upgradeMHVAccount,
      status: 'continue',
    };
  };

  isAccessible = () => {
    if (this._isHealthTool) {
      // Until MHV account eligibility rules no longer have to accommodate the
      // pre-brand consolidation flow, the frontend will gate access using the MHV
      // account level instead of the available services list from the backend,
      // which will already have validated the MHV account level policies.
      const { appId, mhvAccount } = this.props;
      return hasRequiredMhvAccount(appId, mhvAccount.accountLevel);
      // return this.props.availableServices.has(this._requiredServices);
    }

    // Only check whether the account is verified here and leave any handling
    // of gated access for other reasons to the apps after redirect.
    return this.props.profile.verified;
  };

  openLoginModal = () => this.props.toggleLoginModal(true);

  goToTool = () => {
    const url = this._toolUrl;
    if (!url) return;

    if (url.startsWith('/')) {
      window.location = url;
    } else {
      this._popup = window.open(url, 'cta-popup');
      if (this._popup) this._popup.focus();
      else {
        // Indicate an attempted pop-up to avoid automatically showing a
        // pop-up later on a component update triggered by a state change.
        this._popup = true;
      }
    }
  };

  signOut = () => {
    recordEvent({ event: 'logout-link-clicked-createcta-mhv' });
    logout();
  };

  render() {
    const { setFocus } = this.props;
    if (this.props.profile.loading || this.props.mhvAccount.loading) {
      return (
        <LoadingIndicator
          setFocus={setFocus}
          message="Loading your information..."
        />
      );
    }

    const content = this.getContent();

    if (content) return <CallToActionAlert {...content} />;

    if (this.props.children) return this.props.children;

    const isInternalLink = this._toolUrl.startsWith('/');
    const buttonClass = isInternalLink
      ? classNames('usa-button-primary', 'va-button-primary')
      : '';
    const target = isInternalLink ? '_self' : '_blank';

    return (
      <a className={buttonClass} href={this._toolUrl} target={target}>
        {titleCase(this._serviceDescription)}
      </a>
    );
  }
}
CallToActionWidget.defaultProps = {
  setFocus: true,
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const {
    loading,
    mhvAccount,
    /* services, */
    verified,
    multifactor,
    status,
  } = profile;
  return {
    // availableServices: new Set(services),
    isLoggedIn: isLoggedIn(state),
    profile: { loading, verified, multifactor },
    mhvAccount,
    mviDown: status === 'SERVER_ERROR',
  };
};

const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  toggleLoginModal,
  upgradeMHVAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallToActionWidget);
