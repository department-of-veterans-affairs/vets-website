import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import {
  createIsServiceAvailableSelector,
  isMultifactorEnabled,
} from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';

import recordEvent from 'platform/monitoring/record-event';

import ProfileFieldHeading from 'vet360/components/base/Vet360ProfileFieldHeading';

import { handleDowntimeForSection } from '../components/DowntimeBanner';
import LoadFail from '../components/LoadFail';
import PaymentInformation2FARequired from '../components/PaymentInformation2FARequired';
import PaymentInformationEditModal from '../components/PaymentInformationEditModal';
import {
  fetchPaymentInformation,
  savePaymentInformation,
  editModalToggled,
  editModalFieldChanged,
} from '../actions/paymentInformation';
import {
  directDepositAccountInformation,
  directDepositInformation,
  directDepositIsSetUp as directDepositIsSetUpSelector,
} from '../selectors';

const AdditionalInfos = props => (
  <>
    <div className="vads-u-margin-bottom--2">
      <AdditionalInfo
        triggerText="How do I change my direct deposit information for GI Bill and other education benefits?"
        onClick={() =>
          props.recordProfileNavEvent({
            'profile-action': 'view-link',
            'profile-section': 'how-to-change-direct-deposit',
          })
        }
      >
        <p>
          You’ll need to sign in to the eBenefits website with your Premium DS
          Logon account to change your direct deposit information for GI Bill
          and other education benefits online.
        </p>
        <p>
          If you don’t have a Premium DS Logon account, you can register for one
          or upgrade your Basic account to Premium. Your MyHealtheVet or ID.me
          credentials won’t work on eBenefits.
        </p>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=direct-deposit-and-contact-information"
          onClick={() =>
            recordEvent({
              event: 'ebenefits-navigation',
            })
          }
        >
          Go to eBenefits to change your information
        </a>
        <br />
        <a href="/change-direct-deposit/#are-there-other-ways-to-change">
          Find out how to change your information by mail or phone
        </a>
      </AdditionalInfo>
    </div>

    <AdditionalInfo
      triggerText="What’s my bank’s routing number?"
      onClick={() =>
        props.recordProfileNavEvent({
          'profile-action': 'view-link',
          'profile-section': 'whats-bank-routing',
        })
      }
    >
      <p>
        Your bank’s routing number is a 9-digit code that’s based on the U.S.
        location where your bank was opened. It’s the first set of numbers on
        the bottom left of your paper checks. You can also search for this
        number on your bank’s website. If your bank has multiple routing
        numbers, you’ll want the number for the state where you opened your
        account.
      </p>
    </AdditionalInfo>
  </>
);

const recordProfileNavEvent = (customProps = {}) => {
  recordEvent({
    event: 'profile-navigation',
    ...customProps,
  });
};

class PaymentInformation extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isEligible: PropTypes.bool.isRequired,
    multifactorEnabled: PropTypes.bool.isRequired,
    fetchPaymentInformation: PropTypes.func.isRequired,
    editModalToggled: PropTypes.func.isRequired,
    editModalFieldChanged: PropTypes.func.isRequired,
    savePaymentInformation: PropTypes.func.isRequired,
    paymentInformationUiState: PropTypes.object.isRequired,
    paymentInformation: PropTypes.shape({
      responses: PropTypes.arrayOf(
        PropTypes.shape({
          paymentAccount: PropTypes.shape({
            accountNumber: PropTypes.string.isRequired,
            accountType: PropTypes.string.isRequired,
            financialInstitutionName: PropTypes.string.isRequired,
            financialInstitutionRoutingNumber: PropTypes.string.isRequired,
          }),
        }),
      ),
    }),
  };

  componentDidMount() {
    if (this.props.isEligible && this.props.multifactorEnabled) {
      this.props.fetchPaymentInformation();
    }
  }

  handleDirectDepositUpdateSubmit = data => {
    this.props.savePaymentInformation(data);
  };

  handleLinkClick = (linkType, gaProfileSection) => {
    // Open modal.
    this.props.editModalToggled();

    // Push Google Analytics event
    recordProfileNavEvent({
      'profile-action': linkType === 'add' ? 'add-link' : 'edit-link',
      'profile-section': gaProfileSection,
    });
  };

  render() {
    const {
      directDepositIsSetUp,
      isEligible,
      isLoading,
      multifactorEnabled,
      paymentInformation,
      paymentAccount,
    } = this.props;

    let content = null;

    if (!isEligible) {
      return content;
    }

    if (isLoading) {
      return <LoadingIndicator message="Loading payment information..." />;
    }

    if (!multifactorEnabled) {
      content = <PaymentInformation2FARequired />;
    } else if (paymentInformation.error) {
      content = <LoadFail information="payment" />;
    } else if (!directDepositIsSetUp) {
      return null;
    } else {
      content = (
        <>
          <div className="vet360-profile-field">
            <ProfileFieldHeading
              onEditClick={() => this.handleLinkClick('edit', 'bank-name')}
            >
              Bank name
            </ProfileFieldHeading>
            {paymentAccount.financialInstitutionName}
          </div>
          <div className="vet360-profile-field">
            <ProfileFieldHeading
              onEditClick={() => this.handleLinkClick('edit', 'account-number')}
            >
              Account number
            </ProfileFieldHeading>
            {paymentAccount.accountNumber}
          </div>
          <div className="vet360-profile-field">
            <ProfileFieldHeading
              onEditClick={() => this.handleLinkClick('edit', 'account-type')}
            >
              Account type
            </ProfileFieldHeading>
            {paymentAccount.accountType}
          </div>
          <p>
            <strong>Note:</strong> If you think you’ve been the victim of bank
            fraud, please call us at{' '}
            <a href="tel:1-800-827-1000" className="no-wrap">
              800-827-1000
            </a>{' '}
            (TTY: <span className="no-wrap">800-829-4833</span>
            ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.
          </p>

          <PaymentInformationEditModal
            onClose={this.props.editModalToggled}
            onSubmit={this.handleDirectDepositUpdateSubmit}
            isEditing={this.props.paymentInformationUiState.isEditing}
            isSaving={this.props.paymentInformationUiState.isSaving}
            fields={this.props.paymentInformationUiState.editModalForm}
            editModalFieldChanged={this.props.editModalFieldChanged}
            responseError={this.props.paymentInformationUiState.responseError}
          />
        </>
      );
    }

    return (
      <>
        <h2 className="va-profile-heading">
          Direct deposit information for disability compensation and pension
          benefits
        </h2>

        <DowntimeNotification
          render={handleDowntimeForSection('payment information')}
          dependencies={[externalServices.evss]}
        >
          <AdditionalInfos recordProfileNavEvent={recordProfileNavEvent} />
          {content}
        </DowntimeNotification>
      </>
    );
  }
}

const isEvssAvailable = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);

const mapStateToProps = state => ({
  directDepositIsSetUp: directDepositIsSetUpSelector(state),
  multifactorEnabled: isMultifactorEnabled(state),
  isEligible: isEvssAvailable(state),
  isLoading:
    isEvssAvailable(state) &&
    isMultifactorEnabled(state) &&
    !directDepositInformation(state),
  paymentAccount: directDepositAccountInformation(state),
  paymentInformation: directDepositInformation(state),
  paymentInformationUiState: state.vaProfile.paymentInformationUiState,
});

const mapDispatchToProps = {
  fetchPaymentInformation,
  savePaymentInformation,
  editModalToggled,
  editModalFieldChanged,
};

const PaymentInformationContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentInformation);

export default PaymentInformationContainer;

export { PaymentInformation };
