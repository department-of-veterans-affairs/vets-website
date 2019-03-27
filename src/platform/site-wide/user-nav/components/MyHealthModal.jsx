import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
  upgradeMHVAccount,
} from '../../../user/profile/actions';
import { verify } from '../../../user/authentication/utilities';
import { isLoggedIn, selectProfile } from '../../../user/selectors';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

// import recordEvent from '../../monitoring/record-event';

class MyHealthModal extends React.Component {
  getContent = () => {
    const { profile, mhvAccount } = this.props;

    if (!profile.verified) {
      return this.getVerifyContent();
    }

    if (mhvAccount.errors) {
      return this.getMhvErrorContent();
    }

    return this.getInaccessibleHealthToolContent();
  };

  getVerifyContent = () => ({
    heading: 'Verify your identity to access health tools',
    alertText: (
      <p>
        We take your privacy seriously, and we’re committed to protecting your
        information. You’ll need to verify your identity before we can give you
        access to your personal health information.
      </p>
    ),
    modalStyle: 'success',
    primaryButton: {
      action: verify,
      text: 'Verify Your Identity',
    },
  });

  getMhvErrorContent = () => ({
    heading: 'Please try again later',
    alertText: (
      <div>
        <p>
          We're sorry. Something went wrong on our end, and we couldn't connect
          you to health tools.
        </p>

        <h5>What you can do</h5>
        <p>Please try again later.</p>
      </div>
    ),
    modalStyle: 'error',
  });

  getInaccessibleHealthToolContent = () => {
    const { accountState } = this.props.mhvAccount;

    switch (accountState) {
      case 'needs_identity_verification':
        return this.getVerifyContent();
      case 'needs_ssn_resolution':
        return {
          heading:
            'We need to verify your identity before giving you access to your personal health information',
          alertText: (
            <div>
              <p>
                We’re sorry. We can’t match the information you provided with
                what we have in our Veteran records. We take your privacy
                seriously, and we’re committed to protecting your information.
                You won’t be able to access VA.gov health tools until we match
                your information and verify your identity.
              </p>
              <h5>What you can do</h5>
              <p>You can call the VA or submit an online request.</p>
            </div>
          ),
          modalStyle: 'error',
        };

      case 'has_deactivated_mhv_ids':
        return {
          heading: 'Please contact us to reactivate your account',
          alertText: (
            <div>
              <p>
                We’re sorry. Your My HealtheVet account isn't active at this
                time. To use our online health tools, you'll need to call us to
                reactivate your account.
              </p>
              <h5>What you can do</h5>
              <p>
                You can call My HealtheVet or submit an online request for help.
              </p>
            </div>
          ),
          modalStyle: 'error',
        };

      case 'has_multiple_active_mhv_ids':
        return {
          heading: 'It looks like you have more than one My HealtheVet account',
          alertText: (
            <div>
              <p>We’re sorry. We found more than one active account for you.</p>
              <h5>What you can do</h5>
              <p>
                You can call My HealtheVet or submit an online request for help.
              </p>
            </div>
          ),
          modalStyle: 'error',
        };

      case 'register_failed':
        return {
          heading: "We couldn't create a My HealtheVet account for you",
          alertText: (
            <div>
              <p>
                We’re sorry. Something went wrong on our end and we couldn't
                create a My HealtheVet account for you. You'll need a My
                HealtheVet account to access health tools on VA.gov.
              </p>
              <h5>What you can do</h5>
              <p>You can try again later or </p>
            </div>
          ),
          modalStyle: 'error',
        };

      case 'upgrade_failed':
        return {
          heading: 'Something went wrong with upgrading your account',
          alertText: (
            <div>
              <p>
                We’re sorry. Something went wrong on our end while we were
                trying to upgrade your account. You won’t be able to use VA.gov
                health tools until we can fix the problem.
              </p>
              <h5>What you can do</h5>
              <p>
                If you feel you’ve entered your information correctly, please
              </p>
            </div>
          ),
          modalStyle: 'error',
        };

      case 'needs_va_patient':
        return {
          heading: 'It looks like you are not a VA patient',
          alertText: (
            <div>
              <p>We’re sorry. We couldn't find your VA patient record.</p>
              <h5>What you can do</h5>
              <p>
                <strong>If you are a VA patient</strong>, call{' '}
                <a href="tel:1-844-698-2311">1-844-698-2311</a> and press 3 to
                reach your local VA medical center. Let the VA representative
                know that VA.gov cannot locate your patient record.
              </p>
              <p>
                <strong>If you want to become a VA patient</strong>, call{' '}
                <a href="tel:1-844-698-2311">1-844-698-2311</a> and press 3 to
                reach your local VA medical center. Let the VA representative
                know that you want to become a VA patient.
              </p>
            </div>
          ),
          modalStyle: 'error',
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
        heading: `Create a My HealtheVet account to access health tools`,
        alertText: (
          <p>
            You'll need to create a My HealtheVent account before you can access
            our online health tools. This account is cost-free and secure.
          </p>
        ),
        primaryButton: {
          text: 'Create a My HealtheVet Account',
          action:
            accountState === 'needs_terms_acceptance'
              ? redirectToTermsAndConditions
              : this.props.createAndUpgradeMHVAccount,
        },
        modalStyle: 'success',
      };
    }

    return {
      heading: `You’ll need to upgrade your My HealtheVet account before you can ${
        this._serviceDescription
      }. It’ll only take us a minute to do this for you, and it’s free.`,
      buttonText: 'Upgrade Your My HealtheVet Account',
      buttonHandler:
        accountState === 'needs_terms_acceptance'
          ? redirectToTermsAndConditions
          : this.props.upgradeMHVAccount,
      modalStyle: 'continue',
    };
  };

  handleClose = () => {
    this.props.onClose();
    // recordEvent({ event: 'no-login-finish-form' });
  };

  render() {
    const content = this.getContent();

    return (
      <Modal
        id="my-health-modal"
        primaryButton={content.primaryButton}
        visible={this.props.visible}
        focusSelector="button"
        onClose={this.props.onClose}
        status={content.modalStyle}
        title={content.heading}
      >
        {content.alertText}
      </Modal>
    );
  }
}

MyHealthModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

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
  upgradeMHVAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyHealthModal);
