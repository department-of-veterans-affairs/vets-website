import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AcceptTermsPrompt from '../components/AcceptTermsPrompt';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import { mhvAccessError } from '../../../static-data/error-messages';
import {
  acceptTerms,
  createMHVAccount,
  fetchLatestTerms,
  fetchMHVAccount
} from '../../../../platform/user/profile/actions';

const TERMS_NAME = 'mhvac';

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

  state_ineligible: null,

  country_ineligible: null,

  has_multiple_active_mhv_ids: {
    headline: <span>It looks like you have more than one My Health<em>e</em>Vet account</span>,
    content: (
      <div>
        <p>We’re sorry. We can’t give you access to the Vets.gov health tools because we’ve found more than one active account for you in the My Health<em>e</em>Vet system.</p>
        <p>Please call the My HealtheVet Help Desk at 1-877-327-0022 (TTY: 1-800-877-8339), 7:00 a.m. - 7:00 p.m. (CT), and ask for help to delete any extra accounts in the system.</p>
      </div>
    )
  },
};
/* eslint-enable camelcase */

export class MHVApp extends React.Component {
  componentDidMount() {
    const { account } = this.props;

    if (!account.state) {
      this.props.fetchMHVAccount();
    } else {
      this.handleAccountState();
    }
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props;

    const accountStateChanged = prevProps.account.state !== account.state;
    if (accountStateChanged) { this.handleAccountState(); }

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
    if (this.isIneligible()) { return; }

    if (this.needsTermsAcceptance()) {
      this.props.fetchLatestTerms(TERMS_NAME);
    } else if (!this.hasAccount()) {
      this.props.createMHVAccount();
    }
  }

  renderIneligibleMessage = (ineligibleState) => {
    const alertProps = INELIGIBLE_MESSAGES[ineligibleState];

    return alertProps && (
      <AlertBox
        headline={alertProps.headline}
        content={alertProps.content}
        isVisible
        status="error"/>
    );
  }

  render() {
    const { account, terms } = this.props;

    if (account.polling) {
      return <LoadingIndicator setFocus message="Creating your MHV account..."/>;
    }

    if (account.loading || terms.loading) {
      return <LoadingIndicator setFocus message="Loading your information..."/>;
    }

    if (account.errors || terms.errors) {
      const headline = terms.errors ?
        'We\'re not able to process the MHV terms and conditions' :
        'We\'re not able to process your MHV account';

      const content = (
        <p>
          Please <a onClick={() => { window.location.reload(true); }}>refresh this page</a> or try again later. If this problem persists, please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      );

      return (
        <AlertBox
          headline={headline}
          content={content}
          isVisible
          status="error"/>
      );
    }

    if (this.isIneligible()) {
      return this.renderIneligibleMessage(this.props.account.state);
    }

    if (this.needsTermsAcceptance()) {
      return <AcceptTermsPrompt terms={terms} cancelPath="/health-care/" onAccept={this.props.acceptTerms}/>;
    }

    if (!this.hasService()) {
      return mhvAccessError;
    }

    return <div>{this.props.children}</div>;
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

const mapStateToProps = (state) => {
  const { profile } = state.user;
  const { account, terms } = profile.mhv;
  const availableServices = profile.services;
  return { account, availableServices, terms };
};

const mapDispatchToProps = {
  acceptTerms,
  createMHVAccount,
  fetchLatestTerms,
  fetchMHVAccount
};

export default connect(mapStateToProps, mapDispatchToProps)(MHVApp);
