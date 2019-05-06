import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import environment from 'platform/utilities/environment';
import { createIsServiceAvailableSelector } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';

import ProfileFieldHeading from 'applications/personalization/profile360/vet360/components/base/ProfileFieldHeading';

import PaymentInformationEditModal from '../components/PaymentInformationEditModal';
import { fetchPaymentInformation } from '../actions';

function isGated() {
  return environment.isProduction();
}

class PaymentInformation extends React.Component {
  static propTypes = {
    fetchPaymentInformation: PropTypes.func.isRequired,
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

  constructor(props) {
    super(props);
    this.state = {
      isEditModalVisible: false,
    };
  }

  componentDidMount() {
    if (!isGated() && this.props.isEligible) {
      this.props.fetchPaymentInformation();
    }
  }

  toggleEditModal = () => {
    this.setState({ isEditModalVisible: !this.state.isEditModalVisible });
  };

  submitEditModal = () => {
    // Todo
  };

  render() {
    if (isGated()) {
      return null;
    }

    if (!this.props.isEligible) {
      return null;
    }

    if (this.props.isLoading) {
      return <LoadingIndicator message="Loading payment information..." />;
    }

    const { paymentAccount } = this.props.paymentInformation.responses[0];

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
          <ProfileFieldHeading onEditClick={this.toggleEditModal}>
            Bank name
          </ProfileFieldHeading>
          {paymentAccount.financialInstitutionName}
        </div>
        <div className="vet360-profile-field">
          <ProfileFieldHeading onEditClick={this.toggleEditModal}>
            Account type
          </ProfileFieldHeading>
          {paymentAccount.accountType}
        </div>
        <div className="vet360-profile-field">
          <ProfileFieldHeading onEditClick={this.toggleEditModal}>
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
          isVisible={this.state.isEditModalVisible}
          onSubmit={this.submitEditModal}
          onClose={this.toggleEditModal}
          paymentAccount={paymentAccount}
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
});

const mapDispatchToProps = {
  fetchPaymentInformation,
};

const PaymentInformationContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentInformation);

export default PaymentInformationContainer;

export { PaymentInformation };
