import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { selectCurrentlyOpenEditModal } from '../selectors';
import {
  openModal,
  createTransaction,
  updateSelectedAddress,
} from '../actions';

import * as VET360 from '../constants';

class AddressValidationModal extends React.Component {
  onChangeHandler = (address, selectedId) => _event => {
    this.props.updateSelectedAddress(address, selectedId);
  };

  onSubmit = () => {
    const {
      validationKey,
      addressValidationType,
      selectedAddress,
    } = this.props;
    const payload = {
      ...selectedAddress,
      validationKey,
      addressPou:
        addressValidationType === VET360.FIELD_NAMES.MAILING_ADDRESS
          ? VET360.ADDRESS_POU.CORRESPONDENCE
          : VET360.ADDRESS_POU.RESIDENCE,
    };

    const method = payload.id ? 'PUT' : 'POST';

    this.props.createTransaction(
      VET360.API_ROUTES.ADDRESSES,
      method,
      addressValidationType,
      payload,
      this.props.analyticsSectionName,
    );
  };

  renderWarningText = () => {
    const {
      addressValidationError,
      validationKey,
      suggestedAddresses,
    } = this.props;

    let warningText;

    if (suggestedAddresses.length > 1 && validationKey) {
      warningText = `We couldn’t confirm your address with the U.S. Postal Service.  Please verify your address so we can save it to your VA profile.  If the address you entered isn’t correct, please edit it or choose a suggested address below`;
    }

    if (suggestedAddresses.length > 1 && !validationKey) {
      warningText = `We’re sorry.  We couldn’t verify your address with the U.S. Postal Service, so we won't be able to deliver your VA mail to that address.  Please edit the address you entered or choose a suggested address below.`;
    }

    if (addressValidationError && validationKey) {
      warningText = `We couldn’t confirm your address with the U.S. Postal Service.  Please verify your address so we can save it to your VA profile.  If the address you entered isn’t correct, please edit it.`;
    }

    if (addressValidationError && !validationKey) {
      warningText = `We’re sorry.  We couldn’t verify your address with the U.S. Postal Service, so we will not be able to deliver your VA mail to that address.  Please edit the address you entered.`;
    }

    return warningText;
  };

  renderWarningHeadline = () => {
    const {
      addressValidationError,
      validationKey,
      suggestedAddresses,
    } = this.props;

    let warningHeadline;

    if (
      (suggestedAddresses.length > 1 && validationKey) ||
      (addressValidationError && validationKey)
    ) {
      warningHeadline = `Please confirm your address`;
    }

    if (
      (suggestedAddresses.length > 1 && !validationKey) ||
      (addressValidationError && !validationKey)
    ) {
      warningHeadline = `We couldn’t verify your address`;
    }

    return warningHeadline;
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
    const {
      validationKey,
      addressValidationError,
      addressValidationType,
      selectedId,
    } = this.props;
    const {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      stateCode,
      zipCode,
    } = address;

    const isAddressFromUser = id === 'userEntered';
    const showEditLinkErrorState = addressValidationError && validationKey;
    const showEditLinkNonErrorState = !addressValidationError;
    const showEditLink = showEditLinkErrorState || showEditLinkNonErrorState;

    return (
      <div key={id}>
        <input
          style={{ zIndex: '1' }}
          type="radio"
          name={id}
          disabled={isAddressFromUser && !validationKey}
          checked={selectedId === id}
          onClick={this.onChangeHandler(address, id)}
        />
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            {addressLine1 && <span>{addressLine1}</span>}
            {addressLine2 && <span>{` ${addressLine2}`}</span>}
            {addressLine3 && <span>{` ${addressLine3}`}</span>}
            {city &&
              stateCode &&
              zipCode && <span>{` ${city}, ${stateCode} ${zipCode}`}</span>}
            {isAddressFromUser &&
              showEditLink && (
                <a onClick={() => this.props.openModal(addressValidationType)}>
                  Edit Address
                </a>
              )}
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
      addressFromUser,
    } = this.props;

    const shouldShowSuggestions = suggestedAddresses.length > 0;

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
          headline={this.renderWarningHeadline()}
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
  const addressValidationType =
    state.vet360.addressValidation.addressValidationType;

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[addressValidationType],
    isAddressValidationModalVisible:
      selectCurrentlyOpenEditModal(state) === 'addressValidation',
    addressValidationError:
      state.vet360.addressValidation.addressValidationError,
    suggestedAddresses: state.vet360.addressValidation.suggestedAddresses,
    addressValidationType,
    validationKey: state.vet360.addressValidation.validationKey,
    addressFromUser: state.vet360.addressValidation.addressFromUser,
    selectedAddress: state.vet360.addressValidation.selectedAddress,
    selectedId: state.vet360.addressValidation.selectedId,
  };
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(openModal(null)),
  openModal: modalName => dispatch(openModal(modalName)),
  createTransaction,
  updateSelectedAddress: (address, selectedId) =>
    dispatch(updateSelectedAddress(address, selectedId)),
});

AddressValidationModal.propTypes = {
  analyticsSectionName: PropTypes.string,
  isAddressValidationModalVisible: PropTypes.bool.isRequired,
  addressValidationError: PropTypes.bool.isRequired,
  suggestedAddresses: PropTypes.array.isRequired,
  addressValidationType: PropTypes.string.isRequired,
  validationKey: PropTypes.number,
  addressFromUser: PropTypes.object.isRequired,
  selectedAddress: PropTypes.object.isRequired,
  selectedId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  updateSelectedAddress: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
