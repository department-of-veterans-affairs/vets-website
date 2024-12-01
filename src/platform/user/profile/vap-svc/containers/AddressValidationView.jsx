import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  isFailedTransaction,
  isPendingTransaction,
} from 'platform/user/profile/vap-svc/util/transactions';
import {
  hasBadAddress,
  selectAddressValidation,
} from 'platform/user/profile/vap-svc/selectors';
import VAPServiceEditModalErrorMessage from 'platform/user/profile/vap-svc/components/base/VAPServiceEditModalErrorMessage';
import { formatAddress } from 'platform/forms/address/helpers';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement, waitForRenderThenFocus } from 'platform/utilities/ui';
import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';
import TOGGLE_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import * as VAP_SERVICE from '../constants';
import {
  closeModal,
  createTransaction,
  openModal,
  resetAddressValidation as resetAddressValidationAction,
  updateSelectedAddress,
  updateValidationKeyAndSave,
} from '../actions';
import { getValidationMessageKey } from '../util';
import { ADDRESS_VALIDATION_MESSAGES } from '../constants/addressValidationMessages';

class AddressValidationView extends React.Component {
  componentDidMount() {
    // scroll on the alert since the web component doesn't have a focus/suto-scroll method built in like the React component
    waitForRenderThenFocus('#address-validation-alert-heading');
  }

  componentDidUpdate(prevProps) {
    // if the transaction just became pending, start calling the
    // refreshTransaction() on an interval
    if (
      isPendingTransaction(this.props.transaction) &&
      !isPendingTransaction(prevProps.transaction)
    ) {
      this.interval = window.setInterval(
        this.props.refreshTransaction,
        window.VetsGov.pollTimeout || 1000,
      );
    }
    // if the transaction is no longer pending, stop refreshing it
    if (
      isPendingTransaction(prevProps.transaction) &&
      !isPendingTransaction(this.props.transaction)
    ) {
      window.clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    focusElement(`#${this.props.addressValidationType}-edit-link`);
  }

  onChangeSelectedAddress = (address, selectedAddressId) => {
    this.props.updateSelectedAddress(address, selectedAddressId);
  };

  onSubmit = event => {
    event.preventDefault();
    const {
      validationKey,
      addressValidationType,
      selectedAddress,
      selectedAddressId,
      analyticsSectionName,
    } = this.props;

    const payload = {
      ...selectedAddress,
      validationKey,
    };

    const suggestedAddressSelected = selectedAddressId !== 'userEntered';

    const method = payload.id ? 'PUT' : 'POST';

    if (this.props.userHasBadAddress) {
      recordEvent({
        event: 'api_call',
        'api-name': 'Updating bad address',
        'api-status': 'started',
        'profile-section': analyticsSectionName,
        'profile-addressSuggestionUsed': suggestedAddressSelected
          ? 'yes'
          : 'no',
      });
    } else {
      recordEvent({
        event: 'profile-transaction',
        'profile-section': analyticsSectionName,
        'profile-addressSuggestionUsed': suggestedAddressSelected
          ? 'yes'
          : 'no',
      });
    }

    if (suggestedAddressSelected) {
      this.props.updateValidationKeyAndSave(
        VAP_SERVICE.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        analyticsSectionName,
      );
    } else {
      this.props.createTransaction(
        VAP_SERVICE.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        analyticsSectionName,
      );
    }
  };

  onEditClick = () => {
    const {
      addressValidationType,
      addressFromUser,
      analyticsSectionName,
    } = this.props;
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'edit-link',
      'profile-section': analyticsSectionName,
    });
    this.props.openModal(addressValidationType, addressFromUser);
  };

  renderPrimaryButton = () => {
    const {
      addressValidationError,
      validationKey,
      isLoading,
      confirmedSuggestions,
    } = this.props;

    let buttonText = 'Use this address';

    if (confirmedSuggestions.length === 0 && validationKey) {
      buttonText = 'Use this address';
    }

    if (confirmedSuggestions.length === 1 && !validationKey) {
      buttonText = 'Use suggested address';
    }

    if (
      addressValidationError ||
      (!confirmedSuggestions.length && !validationKey)
    ) {
      return (
        <Toggler.Hoc
          toggleName={TOGGLE_NAMES.profileShowNoValidationKeyAddressAlert}
        >
          {toggleValue =>
            !toggleValue ? (
              <button
                onClick={this.onEditClick}
                type="submit"
                className="vads-u-margin-top--1p5 vads-u-width--full mobile-lg:vads-u-width--auto"
              >
                Edit Address
              </button>
            ) : null
          }
        </Toggler.Hoc>
      );
    }

    return (
      <LoadingButton
        isLoading={isLoading}
        type="submit"
        data-testid="confirm-address-button"
        aria-label={isLoading ? 'Loading' : buttonText}
      >
        {buttonText}
      </LoadingButton>
    );
  };

  renderAddressOption = (address, id = 'userEntered') => {
    const {
      confirmedSuggestions,
      selectedAddressId,
      validationKey,
    } = this.props;

    const isAddressFromUser = id === 'userEntered';
    const hasConfirmedSuggestions =
      (confirmedSuggestions.length > 0 && validationKey) ||
      confirmedSuggestions.length > 1;
    const isFirstOptionOrEnabled =
      (isAddressFromUser && validationKey) || !isAddressFromUser;

    const { street, cityStateZip, country } = formatAddress(address);

    return (
      <div key={id} className="address-validation-container">
        {isFirstOptionOrEnabled &&
          hasConfirmedSuggestions && (
            <input
              type="radio"
              id={id}
              onChange={() => {
                this.onChangeSelectedAddress(address, id);
              }}
              checked={selectedAddressId === id}
            />
          )}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-bottom--0p5">
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="street address"
            >
              {street}
            </span>
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="city, state and zip code"
            >
              {cityStateZip}
            </span>
            <span>{country}</span>
          </div>
        </label>
      </div>
    );
  };

  render() {
    const {
      addressFromUser,
      addressValidationError,
      confirmedSuggestions,
      suggestedAddresses,
      transaction,
      transactionRequest,
      isLoading,
      validationKey,
      isNoValidationKeyAlertEnabled,
    } = this.props;

    const validationMessageKey = getValidationMessageKey({
      suggestedAddresses,
      addressValidationError,
      confirmedSuggestions,
      validationKey,
      isNoValidationKeyAlertEnabled, // remove when profileShowNoValidationKeyAddressAlert flag is retired
    });

    const addressValidationMessage =
      ADDRESS_VALIDATION_MESSAGES[validationMessageKey];

    const shouldShowSuggestions = confirmedSuggestions.length > 0;

    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    return (
      <>
        <div role="alert">
          <VaAlert
            className="vads-u-margin-bottom--1 vads-u-margin-top--0"
            status="warning"
            visible
            uswds
          >
            <h4 id="address-validation-alert-heading" slot="headline">
              {addressValidationMessage.headline}
            </h4>
            <addressValidationMessage.ModalText
              editFunction={this.onEditClick}
            />
          </VaAlert>
        </div>
        <form onSubmit={this.onSubmit}>
          <span className="vads-u-font-weight--bold">You entered:</span>
          {this.renderAddressOption(addressFromUser)}
          {shouldShowSuggestions && (
            <span className="vads-u-font-weight--bold">
              Suggested Addresses:
            </span>
          )}
          {shouldShowSuggestions &&
            confirmedSuggestions.map((address, index) =>
              this.renderAddressOption(address, String(index)),
            )}

          {error && (
            <div className="vads-u-margin-bottom--1" role="alert">
              <VAPServiceEditModalErrorMessage error={error} />
            </div>
          )}

          <div className="vads-u-display--flex mobile-lg:vads-u-display--block vads-u-flex-direction--column">
            {this.renderPrimaryButton()}
            {!isLoading && (
              <button
                type="button"
                className="usa-button-secondary vads-u-margin-top--1p4 mobile-lg:vads-u-margin-top--1p5 vads-u-width--full mobile-lg:vads-u-width--auto"
                onClick={this.onEditClick}
              >
                Go back to edit
              </button>
            )}
          </div>
        </form>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps;
  const {
    addressFromUser,
    addressValidationError,
    addressValidationType,
    confirmedSuggestions,
    selectedAddress,
    selectedAddressId,
    suggestedAddresses,
    validationKey,
  } = selectAddressValidation(state);
  const userHasBadAddress = hasBadAddress(state);
  const isNoValidationKeyAlertEnabled =
    state.featureToggles?.profileShowNoValidationKeyAddressAlert; // remove when profileShowNoValidationKeyAddressAlert flag is retired
  return {
    analyticsSectionName:
      VAP_SERVICE.ANALYTICS_FIELD_MAP[addressValidationType],
    isLoading:
      state.vapService.fieldTransactionMap[addressValidationType]?.isPending ||
      isPendingTransaction(transaction),
    addressFromUser,
    addressValidationError,
    addressValidationType,
    confirmedSuggestions,
    selectedAddress,
    selectedAddressId,
    suggestedAddresses,
    userHasBadAddress,
    validationKey,
    isNoValidationKeyAlertEnabled, // remove when profileShowNoValidationKeyAddressAlert flag is retired
  };
};

const mapDispatchToProps = {
  closeModal,
  openModal,
  updateSelectedAddress,
  updateValidationKeyAndSave,
  createTransaction,
  resetAddressValidation: resetAddressValidationAction,
};

AddressValidationView.propTypes = {
  addressFromUser: PropTypes.object.isRequired,
  addressValidationError: PropTypes.bool.isRequired,
  addressValidationType: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  suggestedAddresses: PropTypes.array.isRequired,
  updateSelectedAddress: PropTypes.func.isRequired,
  updateValidationKeyAndSave: PropTypes.func.isRequired,
  analyticsSectionName: PropTypes.string,
  confirmedSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      addressLine1: PropTypes.string.isRequired,
      addressType: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      countryName: PropTypes.string.isRequired,
      countryCodeIso3: PropTypes.string.isRequired,
      countyCode: PropTypes.string.isRequired,
      countyName: PropTypes.string.isRequired,
      stateCode: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      addressPou: PropTypes.string.isRequired,
    }),
  ),
  isLoading: PropTypes.bool,
  isNoValidationKeyAlertEnabled: PropTypes.bool,
  refreshTransaction: PropTypes.func,
  selectedAddress: PropTypes.object,
  selectedAddressId: PropTypes.string,
  transaction: PropTypes.string,
  transactionRequest: PropTypes.object,
  userHasBadAddress: PropTypes.bool,
  validationKey: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationView);
