import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import appendQuery from 'append-query';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// eslint-disable-next-line deprecate/import
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { fetchMHVAccount } from 'platform/user/profile/actions';
import { mhvAccessError } from '../../../static-data/error-messages';
import backendServices from '../../profile/constants/backendServices';
import { selectProfile } from '../../selectors';
import SubmitSignInForm from '../../../static-data/SubmitSignInForm';

/* eslint-disable camelcase */
const INELIGIBLE_MESSAGES = {
  needs_ssn_resolution: {
    headline: `We can’t give you access to the VA.gov health tools`,
    content: (
      <div>
        <p>
          We’re sorry. We can’t match your Social Security number to our Veteran
          records. We won’t be able to give you access to the VA.gov health
          tools until we can match your information to verify your identity.
        </p>
        <p>
          Please check the information you entered and make sure it matches the
          information in your records. If you feel you’ve entered your
          information correctly, and it’s still not matching, please contact
          your nearest VA medical center. Let them know you need to verify the
          information in your records, and update it as needed. The operator, or
          a patient advocate, can connect with you with the right person who can
          help.
        </p>
      </div>
    ),
  },

  needs_va_patient: {
    headline: `We can’t give you access to the VA.gov health tools`,
    content: (
      <div>
        <p>
          We’re sorry. We can’t give you access to the VA.gov health tools
          because we can’t verify that you’re a VA patient. Only patients who’ve
          received care at a VA health facility can use these tools.
        </p>
        <p>
          If you’ve received care at a VA medical center, clinic, or Vet center,
          please call that facility to find out if you’re in their records.
        </p>
      </div>
    ),
  },

  has_deactivated_mhv_ids: {
    headline: (
      <span>It looks like you’ve disabled your My HealtheVet account</span>
    ),
    content: (
      <div>
        <p>
          We’re sorry. We can’t give you access to the VA.gov health tools
          because it looks like you already have a My HealtheVet account that’s
          been disabled.
        </p>
        <p>
          Please call the My HealtheVet Help Desk at 877-327-0022 (TTY:
          <va-telephone contact={CONTACTS.HELP_TTY} />
          ), 7:00 a.m. - 7:00 p.m. CT, and ask for help to activate your
          disabled account.
        </p>
      </div>
    ),
  },

  has_multiple_active_mhv_ids: {
    headline: (
      <span>It looks like you have more than one My HealtheVet account</span>
    ),
    content: (
      <div>
        <p>
          We’re sorry. We can’t give you access to the VA.gov health tools
          because we’ve found more than one active account for you in the My
          HealtheVet system.
        </p>
        <p>
          Please call the My HealtheVet Help Desk at 877-327-0022 (TTY:
          <va-telephone contact={CONTACTS.HELP_TTY} />
          ), 7:00 a.m. - 7:00 p.m. CT, and ask for help to delete any extra
          accounts in the system.
        </p>
      </div>
    ),
  },
};
/* eslint-enable camelcase */

export class MHVApp extends React.Component {
  componentDidMount() {
    this.props.fetchMHVAccount();
  }

  componentDidUpdate(prevProps) {
    const { accountState } = this.props.mhvAccount;

    const accountStateChanged =
      prevProps.mhvAccount.accountState !== accountState;
    if (accountStateChanged) {
      this.handleAccountState();
    }
  }

  hasService = () =>
    this.props.availableServices.includes(this.props.serviceRequired);

  shouldShowIneligibleMessage = () =>
    this.props.mhvAccount.accountState in INELIGIBLE_MESSAGES;

  handleAccountState = () => {
    if (this.hasService() || this.shouldShowIneligibleMessage()) {
      return;
    }

    const { accountState } = this.props.mhvAccount;

    // Unverified accounts should have been handled before this component
    // rendered, but if it hasn't for some reason, we will redirect now.
    if (accountState === 'needs_identity_verification') {
      const nextQuery = { next: window.location.pathname };
      const verifyUrl = appendQuery('/verify/', nextQuery);
      window.location.replace(verifyUrl);
      return;
    }

    switch (accountState) {
      case 'needs_terms_acceptance': {
        const redirectQuery = { tc_redirect: window.location.pathname }; // eslint-disable-line camelcase
        const termsConditionsUrl = appendQuery(
          '/health-care/medical-information-terms-conditions/',
          redirectQuery,
        );
        window.location.replace(termsConditionsUrl);
        break;
      }

      case 'no_account':
      case 'existing':
      case 'registered':
        // We will no longer be creating or upgrading MHV accounts
        break;

      default: // Do nothing.
    }
  };

  closeTcAcceptanceMessage = () => {
    this.context.router.replace({
      ...this.props.location,
      query: {
        ...this.props.location.query,
        tc_accepted: undefined, // eslint-disable-line camelcase
      },
    });
  };

  renderTcAcceptanceMessage = () => {
    // Use query param to detect redirect from accepting T&C.
    if (!this.props.location.query.tc_accepted) {
      return null;
    }

    return (
      <VaAlert
        visible
        status="success"
        closeable
        onCloseEvent={this.closeTcAcceptanceMessage}
      >
        <h2 slot="headline">
          Thank you for accepting the Terms and Conditions for using VA.gov
          health tools
        </h2>
        <p>You can now access health tools on VA.gov.</p>
      </VaAlert>
    );
  };

  renderPlaceholderErrorMessage = () => {
    return (
      <va-alert visible status="error">
        <h3 slot="headline">
          We’re not able to process your My HealtheVet account
        </h3>
        <p>
          Please{' '}
          <button type="button" onClick={() => window.location.reload(true)}>
            refresh this page
          </button>{' '}
          or try again later. If you keep having trouble, please{' '}
          <SubmitSignInForm />
        </p>
      </va-alert>
    );
  };

  renderIneligibleMessage = ineligibleState => {
    const alertProps = INELIGIBLE_MESSAGES[ineligibleState];

    if (alertProps) {
      return (
        <va-alert visible status="error">
          <h3 slot="headline">{alertProps.headline}</h3>
          {alertProps.content}
        </va-alert>
      );
    }

    return mhvAccessError;
  };

  renderAccountUnknownMessage = () => {
    const alertProps = {
      headline: 'We can’t confirm your My HealtheVet account level',
      content: (
        <p>
          We’re sorry. Something went wrong on our end. We can’t confirm your My
          HealtheVet account level right now. You can use most of the tools on
          VA.gov, but you won’t be able to send secure messages or refill
          prescriptions at this time. We’re working to fix this. Please check
          back later.
        </p>
      ),
    };

    return (
      <va-alert visible status="error">
        <h3 slot="headline">{alertProps.headline}</h3>
        {alertProps.content}
      </va-alert>
    );
  };

  renderRegisterFailedMessage = () => {
    const alertProps = {
      headline: `We can’t give you access to VA.gov health tools right now`,
      content: (
        <p>
          We’re sorry. Something went wrong on our end that’s preventing you
          from using the health tools right now. We’ve verified your information
          so you’ll be able to use tools like prescription refills and secure
          messaging the next time you sign in. Please try signing in later.
        </p>
      ),
    };

    return (
      <va-alert visible status="error">
        <h3 slot="headline">{alertProps.headline}</h3>
        {alertProps.content}
      </va-alert>
    );
  };

  renderUpgradeFailedMessage = () => {
    const alertProps = {
      headline: `We can’t give you access to VA.gov health tools right now`,
      content: (
        <p>
          We’re sorry. We started the process of creating the MyHealtheVet
          account you’ll need to access the VA.gov health tools, but something
          went wrong on our end before we could complete it. We’ve created your
          MyHealtheVet account, but we still need to upgrade it to the security
          level needed to use tools that access your health-related information.
          We’re working to fix this so you can use the tools as soon as
          possible. Please try signing in again later.
        </p>
      ),
    };

    return (
      <va-alert visible status="error">
        <h3 slot="headline">{alertProps.headline}</h3>
        {alertProps.content}
      </va-alert>
    );
  };

  render() {
    const {
      accountLevel,
      accountState,
      errors,
      loading,
    } = this.props.mhvAccount;

    if (loading) {
      return (
        <va-loading-indicator set-focus message="Loading your information..." />
      );
    }

    if (errors) {
      return this.renderPlaceholderErrorMessage();
    }

    if (accountLevel === 'Unknown') {
      return this.renderAccountUnknownMessage();
    }

    if (accountState === 'register_failed') {
      return this.renderRegisterFailedMessage();
    }

    if (accountState === 'upgrade_failed') {
      return this.renderUpgradeFailedMessage();
    }

    if (this.shouldShowIneligibleMessage()) {
      return this.renderIneligibleMessage(accountState);
    }

    if (!this.hasService()) {
      if (accountState === 'needs_identity_verification') {
        return (
          <va-loading-indicator set-focus message="Redirecting to verify..." />
        );
      }

      if (accountState === 'needs_terms_acceptance') {
        return (
          <va-loading-indicator
            set-focus
            message="Redirecting to terms and conditions..."
          />
        );
      }

      return mhvAccessError;
    }

    return (
      <div>
        {this.renderTcAcceptanceMessage()}
        {this.props.children}
      </div>
    );
  }
}

MHVApp.propTypes = {
  children: PropTypes.node,
  fetchMHVAccount: PropTypes.func,
  mhvAccount: PropTypes.object,
  serviceRequired: PropTypes.oneOf([
    backendServices.HEALTH_RECORDS,
    backendServices.MESSAGING,
    backendServices.RX,
  ]),
};

MHVApp.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { mhvAccount } = profile;
  const availableServices = profile.services;
  return { mhvAccount, availableServices };
};

const mapDispatchToProps = { fetchMHVAccount };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MHVApp));
