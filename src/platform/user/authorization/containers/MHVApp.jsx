import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import appendQuery from 'append-query';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import { mhvAccessError } from '../../../static-data/error-messages';
import {
  createMHVAccount,
  fetchMHVAccount
} from '../../../../platform/user/profile/actions';

/* eslint-disable camelcase */
const INELIGIBLE_MESSAGES = {
  needs_identity_verification: null,

  needs_ssn_resolution: {
    headline: 'We can’t give you access to the Vets.gov health tools',
    content: (
      <div>
        <p>We’re sorry. We can’t match your Social Security number to our Veteran records. We won’t be able to give you access to the Vets.gov health tools until we can match your information to verify your identity.</p>
        <p>Please check the information you entered and make sure it matches the information in your records. If you feel you’ve entered your information correctly, and it’s still not matching, please contact your nearest VA medical center. Let them know you need to verify the information in your records, and update it as needed. The operator, or a patient advocate, can connect with you with the right person who can help.</p>
      </div>
    )
  },

  needs_va_patient: {
    headline: 'We can’t give you access to the Vets.gov health tools',
    content: (
      <div>
        <p>We’re sorry. We can’t give you access to the Vets.gov health tools because we can’t verify that you’re a VA patient. Only patients who’ve received care at a VA health facility can use these tools.</p>
        <p>If you’ve received care at a VA medical center, clinic, or Vet center, please call that facility to find out if you’re in their records.</p>
      </div>
    )
  },

  has_deactivated_mhv_ids: {
    headline: <span>It looks like you’ve disabled your My Health<em>e</em>Vet account</span>,
    content: (
      <div>
        <p>We’re sorry. We can’t give you access to the Vets.gov health tools because it looks like you already have a My Health<em>e</em>Vet account that’s been disabled.</p>
        <p>Please call the My Health<em>e</em>Vet Help Desk at 1-877-327-0022 (TTY: 1-800-877-8339), 7:00 a.m. - 7:00 p.m. (CT), and ask for help to activate your disabled account.</p>
      </div>
    )
  },

  has_multiple_active_mhv_ids: {
    headline: <span>It looks like you have more than one My Health<em>e</em>Vet account</span>,
    content: (
      <div>
        <p>We’re sorry. We can’t give you access to the Vets.gov health tools because we’ve found more than one active account for you in the My Health<em>e</em>Vet system.</p>
        <p>Please call the My Health<em>e</em>Vet Help Desk at 1-877-327-0022 (TTY: 1-800-877-8339), 7:00 a.m. - 7:00 p.m. (CT), and ask for help to delete any extra accounts in the system.</p>
      </div>
    )
  }
};
/* eslint-enable camelcase */

export class MHVApp extends React.Component {
  componentDidMount() {
    this.props.fetchMHVAccount();
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props;

    const accountStateChanged = prevProps.account.state !== account.state;
    if (accountStateChanged) { this.handleAccountState(); }

    // Check the account state again if we just got an error.
    // If it occurred from fetching the account, this is just a retry.
    // If it occurred from account creation, we will get the corresponding
    // failure state and handle it accordingly.
    if (!prevProps.account.errors && account.errors) { this.props.fetchMHVAccount(); }

    const shouldPollAccount = account.polling && !account.loading && !this.hasAccount();
    if (shouldPollAccount) {
      setTimeout(() => {
        this.props.fetchMHVAccount();
      }, 1000 * account.polledTimes);
    }
  }

  needsTermsAcceptance = () => this.props.account.state === 'needs_terms_acceptance';

  hasAccount = () => ['existing', 'upgraded'].includes(this.props.account.state);

  hasService = () => this.props.availableServices.includes(this.props.serviceRequired);

  isIneligible = () => this.props.account.state in INELIGIBLE_MESSAGES;

  handleAccountState = () => {
    if (this.isIneligible()) {
      // Unverified accounts should have been handled before this component
      // rendered, but if it hasn't for some reason, we will redirect now.
      if (this.props.account.state === 'needs_identity_verification') {
        const nextQuery = { next: window.location.pathname };
        const verifyUrl = appendQuery('/verify', nextQuery);
        window.location.replace(verifyUrl);
      }

      return;
    }

    if (this.needsTermsAcceptance()) {
      const redirectQuery = { tc_redirect: window.location.pathname }; // eslint-disable-line camelcase
      const termsConditionsUrl = appendQuery('/health-care/medical-information-terms-conditions', redirectQuery);
      window.location.replace(termsConditionsUrl);
    } else if (!this.hasAccount()) {
      this.props.createMHVAccount();
    }
  }

  closeTcAcceptanceMessage = () => {
    this.context.router.replace({
      ...this.props.location,
      query: {
        ...this.props.location.query,
        tc_accepted: undefined // eslint-disable-line camelcase
      }
    });
  }

  renderTcAcceptanceMessage = () => {
    // Use query param to detect redirect from accepting T&C.
    if (!this.props.location.query.tc_accepted) { return null; }

    const alertProps = {
      headline: 'Thank you for accepting the Terms and Conditions for using Vets.gov health tools',
      content: (
        <p>You can now access health tools on Vets.gov.</p>
      ),
      onCloseAlert: this.closeTcAcceptanceMessage
    };

    return <AlertBox isVisible status="success" {...alertProps}/>;
  }

  renderIneligibleMessage = (ineligibleState) => {
    const alertProps = INELIGIBLE_MESSAGES[ineligibleState];

    if (alertProps) {
      return (
        <AlertBox
          headline={alertProps.headline}
          content={alertProps.content}
          isVisible
          status="error"/>
      );
    }

    return mhvAccessError;
  }

  renderAccountUnknownMessage() {
    const alertProps = {
      headline: <span>We can’t confirm your My Health<em>e</em>Vet account level</span>,
      content: (
        <p>
          We’re sorry. Something went wrong on our end. We can’t confirm your My HealtheVet account level right now. You can use most of the tools on Vets.gov, but you won’t be able to send secure messages or refill prescriptions at this time. We’re working to fix this. Please check back later.
        </p>
      )
    };

    return <AlertBox isVisible status="error" {...alertProps}/>;
  }

  renderPlaceholderErrorMessage() {
    const alertProps = {
      headline: <span>We’re not able to process your My Health<em>e</em>Vet account</span>,
      content: (
        <p>
          Please <a onClick={() => { window.location.reload(true); }}>refresh this page</a> or try again later. If this problem persists, please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      )
    };

    return <AlertBox isVisible status="error" {...alertProps}/>;
  }

  render() {
    const { account } = this.props;

    if (account.polling) {
      return <LoadingIndicator setFocus message="Creating your MHV account..."/>;
    }

    if (account.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    if (account.errors) { return this.renderPlaceholderErrorMessage(); }

    if (account.level === 'Unknown') { return this.renderAccountUnknownMessage(); }

    if (this.isIneligible()) { return this.renderIneligibleMessage(this.props.account.state); }

    if (!this.hasService()) { return mhvAccessError; }

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
  serviceRequired: PropTypes.oneOf([
    'health-records',
    'messaging',
    'rx'
  ])
};

MHVApp.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const { profile } = state.user;
  const { account } = profile.mhv;
  const availableServices = profile.services;
  return { account, availableServices };
};

const mapDispatchToProps = {
  createMHVAccount,
  fetchMHVAccount
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MHVApp));
