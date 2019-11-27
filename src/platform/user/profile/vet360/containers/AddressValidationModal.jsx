import React from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { selectCurrentlyOpenEditModal } from '../selectors';
import { openModal, createTransaction } from '../actions';

import * as VET360 from '../constants';

class AddressValidationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: '',
      address: {},
    };
  }
  onChangeHandler = address => event => {
    this.setState({ selectedOption: event.target.name, address });
  };

  onSubmit = () => {
    const { validationKey, fieldName } = this.props;
    const { address } = this.state;
    const payload = {
      ...address,
      validationKey,
      addressPou:
        fieldName === VET360.FIELD_NAMES.MAILING_ADDRESS
          ? VET360.ADDRESS_POU.CORRESPONDENCE
          : VET360.ADDRESS_POU.RESIDENCE,
    };

    const method = payload.id ? 'PUT' : 'POST';

    this.props.createTransaction(
      VET360.API_ROUTES.ADDRESSES,
      method,
      fieldName,
      payload,
      this.props.analyticsSectionName,
    );
  };

  renderWarningText = () => {
    const { addressValidationError } = this.props;

    return addressValidationError
      ? 'We’re sorry. It looks like the address you entered isn’t valid.  Please edit your address'
      : 'We’re sorry. It looks like the address you entered isn’t valid.  Please enter your address again or choose a suggested address below';
  };

  renderPrimaryButton = () => {
    const {
      addressValidationError,
      addressValidationType,
      validationKey,
    } = this.props;

    if (addressValidationError && !validationKey) {
      return (
        <button
          className="usa-button-primary"
          onClick={() => this.props.openModal(addressValidationType)}
        >
          Edit Address
        </button>
      );
    }

    return <button className="usa-button-primary">Continue</button>;
  };

  renderAddressOption = (address, id = 'userEntered') => {
    const { validationKey } = this.props;
    const {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      stateCode,
      zipCode,
    } = address;

    const isOptionDisabled = id === 'userEntered' && !validationKey;

    return (
      <div key={id}>
        <input
          style={{ zIndex: '1' }}
          type="radio"
          name={id}
          disabled={isOptionDisabled}
          checked={this.state.selectedOption === id}
          onClick={this.onChangeHandler(address)}
        />
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            {addressLine1 && <span>{addressLine1}</span>}
            {addressLine2 && <span>{addressLine2}</span>}
            {addressLine3 && <span>{addressLine3}</span>}
            <span>{` ${city}, ${stateCode} ${zipCode}`}</span>
          </div>
        </label>
      </div>
    );
  };

  render() {
    const {
      closeModal,
      isAddressValidationModalVisible,
      addressValidationType,
      suggestedAddresses,
      userEnteredAddress,
    } = this.props;

    const shouldShowSuggestions = suggestedAddresses.length > 0;

    const addressFromUser =
      userEnteredAddress?.[`${addressValidationType}`]?.value || {};

    return (
      <Modal
        title={
          addressValidationType.includes('mailing')
            ? 'Edit mailing address'
            : 'Edit home address'
        }
        id="address-validation-warning"
        onClose={closeModal}
        visible={isAddressValidationModalVisible}
      >
        <AlertBox
          className="vads-u-margin-bottom--1"
          status="warning"
          headline="Your address update isn't valid"
        >
          <p>{this.renderWarningText()}</p>
        </AlertBox>
        <form onSubmit={this.onSubmit}>
          <span className="vads-u-font-weight--bold">You entered:</span>
          {this.renderAddressOption(addressFromUser)}
          {shouldShowSuggestions && (
            <span className="vads-u-font-weight--bold">
              Suggested Addresses:
            </span>
          )}
          {shouldShowSuggestions &&
            suggestedAddresses.map((address, index) =>
              this.renderAddressOption(address, String(index)),
            )}
          {this.renderPrimaryButton()}
          <button className="usa-button-secondary" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const addressValidationType = state.vet360.addressValidationType;

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[addressValidationType],
    isAddressValidationModalVisible:
      selectCurrentlyOpenEditModal(state) === 'addressValidation',
    addressValidationError: state.vet360.addressValidationError,
    suggestedAddresses: state.vet360.suggestedAddresses,
    addressValidationType,
    userEnteredAddress: state.vet360.formFields,
    validationKey: state.vet360.validationKey,
  };
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(openModal(null)),
  openModal: modalName => dispatch(openModal(modalName)),
  createTransaction,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
