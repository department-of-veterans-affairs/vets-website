import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import { createIsServiceAvailableSelector } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';

import ProfileFieldHeading from 'applications/personalization/profile360/vet360/components/base/ProfileFieldHeading';

import PaymentInformationEditModal from '../components/PaymentInformationEditModal';
import {
  fetchPaymentInformation,
  savePaymentInformation,
  editModalToggled,
  editModalFieldChanged,
} from '../actions/paymentInformation';

import featureFlags from '../featureFlags';

class PaymentInformation extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isEligible: PropTypes.bool.isRequired,
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
    if (this.props.isEligible) {
      this.props.fetchPaymentInformation();
    }
  }

  render() {
    if (!this.props.isEligible) {
      return null;
    }

    if (this.props.isLoading) {
      return <LoadingIndicator message="Loading payment information..." />;
    }

    const { paymentInformation } = this.props;

    // @todo Determine what an uninitialized state really looks like -
    // Is responses null? Do we really need to check responses.length?
    // Is there a paymentAccount, but containing only empty values?

    if (!paymentInformation.responses || !paymentInformation.responses.length) {
      return null;
    }

    const { paymentAccount } = paymentInformation.responses[0];

    return (
      <>
        <h2 className="va-profile-heading">
          Direct Deposit Information for Compensation and Pension
        </h2>
        <AdditionalInfo triggerText="How do I update my GI Bill direct deposit information?">
          <p>
            To update your GI Bill direct deposit, go to your{' '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=direct-deposit-and-contact-information"
            >
              eBenefits
            </a>
            .
          </p>
        </AdditionalInfo>
        <div className="vet360-profile-field">
          <ProfileFieldHeading onEditClick={this.props.editModalToggled}>
            Bank name
          </ProfileFieldHeading>
          {paymentAccount.financialInstitutionName}
        </div>
        <div className="vet360-profile-field">
          <ProfileFieldHeading onEditClick={this.props.editModalToggled}>
            Account type
          </ProfileFieldHeading>
          {paymentAccount.accountType}
        </div>
        <div className="vet360-profile-field">
          <ProfileFieldHeading onEditClick={this.props.editModalToggled}>
            Account number
          </ProfileFieldHeading>
          {paymentAccount.accountNumber}
        </div>
        <p>
          <strong>
            If you suspect fraud has occured, please call MyVA311 at
            1-800-827-1000.
          </strong>
        </p>
        <PaymentInformationEditModal
          onClose={this.props.editModalToggled}
          onSubmit={this.props.savePaymentInformation}
          isEditing={this.props.paymentInformationUiState.isEditing}
          isSaving={this.props.paymentInformationUiState.isSaving}
          fields={this.props.paymentInformationUiState.editModalForm}
          editModalFieldChanged={this.props.editModalFieldChanged}
          responseError={this.props.paymentInformationUiState.responseError}
        />
      </>
    );
  }
}

const isEvssAvailable = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);

const mapStateToProps = state => ({
  isEligible: isEvssAvailable(state),
  isLoading: !state.vaProfile.paymentInformation,
  paymentInformation: state.vaProfile.paymentInformation,
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

const noop = () => null;

export default (featureFlags.directDeposit
  ? PaymentInformationContainer
  : noop);

export { PaymentInformation };
