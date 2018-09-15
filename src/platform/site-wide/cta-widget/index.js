import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { toggleLoginModal } from '../user-nav/actions';
import { verify } from '../../user/authentication/utilities';

import {
  createMHVAccount,
  fetchMHVAccount,
  upgradeMHVAccount
} from '../../user/profile/actions';

import { isLoggedIn, selectProfile } from '../../user/selectors';

const lowerEnvironments = [
  'development',
  'staging',
  'devpreview',
  'preview',
  'vagovdev',
  'vagovstaging'
];

const mhvDomain = lowerEnvironments.includes(__BUILDTYPE__) ?
  'https://mhv-syst.myhealth.va.gov' :
  'https://www.myhealth.va.gov';

const urlMap = {
  '/health-care/secure-messaging/': `${mhvDomain}/mhv-portal-web/secure-messaging`,

  '/health-care/refill-track-prescriptions/': `${mhvDomain}/mhv-portal-web/web/myhealthevet/refill-prescriptions`,

  '/health-care/schedule-view-va-appointments/': `${mhvDomain}/mhv-portal-web/web/myhealthevet/scheduling-a-va-appointment`,

  '/health-care/view-test-and-lab-results/': `${mhvDomain}/mhv-portal-web/labs-tests`
};

/* eslint-disable camelcase */
const contentMap = {
  needs_identity_verification: {
    heading: 'You’ll need to verify your identity before you can send secure messages to your health care team',
    alertText: <p>When you verify your identity, you’ll be able to use VA.gov health tools to do things like refill prescriptions, schedule appointments, and get your medical records.</p>,
    buttonText: 'Verify Your Identity',
    buttonHandler: verify
  },

  needs_ssn_resolution: {
    headline: 'We can’t let you send secure messages to your health care team',
    alertText: (
      <div>
        <p>We’re sorry. We can’t match your Social Security number to our Veteran records. You can’t access the VA.gov health tools until we match your information and can verify your identity.</p>
        <p>If you feel you’ve entered your information correctly, please contact your nearest VA medical center. Let them know you need to verify your records.</p>
        <p><a href="/facilities">Find your nearest VA health facility.</a></p>
      </div>
    )
  },

  has_deactivated_mhv_ids: {
    headline: 'It looks like you’ve disabled your My HealtheVet account',
    alertText: (
      <div>
        <p>We’re sorry. We can’t give you access to the Vets.gov health tools because it looks like you already have a My Health<em>e</em>Vet account that’s been disabled.</p>
        <p>Please call the My Health<em>e</em>Vet Help Desk at 1-877-327-0022 (TTY: 1-800-877-8339), 7:00 a.m. - 7:00 p.m. (CT), and ask for help to activate your disabled account.</p>
      </div>
    )
  },

  has_multiple_active_mhv_ids: {
    headline: 'It looks like you have more than one My HealtheVet account',
    alertText: (
      <div>
        <p>We’re sorry. We can’t give you access to the Vets.gov health tools because we’ve found more than one active account for you in the My Health<em>e</em>Vet system.</p>
        <p>Please call the My Health<em>e</em>Vet Help Desk at 1-877-327-0022 (TTY: 1-800-877-8339), 7:00 a.m. - 7:00 p.m. (CT), and ask for help to delete any extra accounts in the system.</p>
      </div>
    )
  },

  registered_failed: {
    heading: 'We can’t let you send secure messages to your health care team',
    alertText: (
      <div>
        <p>
          We’re sorry. Something went wrong on our end while we were trying to upgrade your account. You won’t be able to use VA.gov health tools until we can figure out what’s wrong with your account
        </p>
        <p>
          Please call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      </div>
    ),
  },

  upgrade_failed: {
    heading: 'We can’t let you send secure messages to your health care team',
    alertText: (
      <div>
        <p>
          We’re sorry. Something went wrong on our end while we were trying to upgrade your account. You may not be able to use all VA.gov health tools until we can figure out what’s wrong with your account
        </p>
        <p>
          Please call the VA.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      </div>
    )
  }
};
/* eslint-enable camelcase */

const genericError = {
  heading: 'Generic error',
  alertText: <p>Generic error</p>
};

export class CallToActionWidget extends React.Component {
  constructor(props) {
    super(props);
    this._popup = null;
    this._loginContent = {
      heading: 'You’ll need to sign in before you can send secure messages to your health care team',
      alertText: <p>Try signing in with your DS Logon, MyHealtheVet, or ID.me account. If you don’t have any of those accounts, you can create one.</p>,
      buttonText: 'Sign In or Create an Account',
      buttonHandler: () => props.toggleLoginModal(true)
    };
  }

  componentDidMount() {
    if (this.props.isLoggedIn) this.props.fetchMHVAccount();
  }

  componentDidUpdate() {
    if (!this.props.isLoggedIn) return;

    if (this.hasService() && !this._popup) this.redirect();

    const { accountState, loading } = this.props.mhvAccount;

    if (!loading) {
      if (accountState) this.handleAccountState();
      else this.props.fetchMHVAccount();
    }
  }

  getContent() {
    if (!this.props.isLoggedIn) return this._loginContent;

    const { accountState } = this.props.mhvAccount;

    if (!this.hasService()) {
      return contentMap[accountState] || genericError;
    }

    if (accountState === 'upgrade_failed') {
      return {
        heading: 'We couldn’t upgrade your account, but you can still refill prescriptions',
        alertText: <p>We’re sorry. Something went wrong on our end while we were trying to upgrade your account. You may not be able to use all VA.gov health tools until we can figure out what’s wrong with your account. For now, you can still refill prescriptions.</p>,
        buttonText: 'Refill or Track Your Prescriptions',
        buttonHandler: this.redirect
      };
    }

    return {
      heading: 'MyHealtheVet should open in a new tab where you can send secure messages to your health care team',
      buttonText: 'Go to MyHealtheVet',
      buttonHandler: this.redirect
    };
  }

  handleAccountState = () => {
    switch (this.props.mhvAccount.accountState) {
      case 'no_account':
        this.props.createMHVAccount();
        break;

      case 'existing':
      case 'registered':
        this.props.upgradeMHVAccount();
        break;

      default: // Do nothing.
    }
  }

  redirect = () => {
    const redirectUrl = urlMap[location.pathname];
    this._popup = window.open(redirectUrl, 'cta-popup');
    if (this._popup) this._popup.focus();
  }

  hasService = () => this.props.availableServices.includes(this.props.serviceRequired);

  render() {
    if (this.props.mhvAccount.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    const {
      heading,
      alertText,
      buttonText,
      buttonHandler
    } = this.getContent();

    return (
      <div className="va-sign-in-alert usa-alert usa-alert-info">
        <div className="usa-alert-body">
          <h4 className="usa-alert-heading">{heading}</h4>
          <div className="usa-alert-text">
            {alertText}
            {buttonText && <button className="usa-button-primary" onClick={buttonHandler}>{buttonText}</button>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const profile = selectProfile(state);
  const { mhvAccount, services } = profile;
  return {
    availableServices: services,
    isLoggedIn: isLoggedIn(state),
    mhvAccount
  };
};

const mapDispatchToProps = {
  createMHVAccount,
  fetchMHVAccount,
  toggleLoginModal,
  upgradeMHVAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(CallToActionWidget);
