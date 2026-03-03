import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  VaAlert,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  isFailedTransaction,
  isPendingTransaction,
} from 'platform/user/profile/vap-svc/util/transactions';
import VAPServiceEditModalErrorMessage from 'platform/user/profile/vap-svc/components/base/VAPServiceEditModalErrorMessage';
import { formatAddress } from 'platform/forms/address/helpers';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { hasBadAddress } from '../selectors';
import {
  openModal,
  createTransaction,
  updateSelectedAddress,
  updateValidationKeyAndSave,
  closeModal,
  resetAddressValidation as resetAddressValidationAction,
} from '../actions';
import { getValidationMessageKey } from '../util';
import { ADDRESS_VALIDATION_MESSAGES } from '../constants/addressValidationMessages';

import * as VAP_SERVICE from '../constants';

const AddressValidationModal = ({
  addressFromUser,
  addressValidationError,
  addressValidationType,
  analyticsSectionName,
  closeModal: closeModalAction,
  confirmedSuggestions,
  createTransaction: createTransactionAction,
  isLoading,
  openModal: openModalAction,
  overrideValidationKey,
  resetAddressValidation,
  selectedAddress,
  selectedAddressId,
  suggestedAddresses,
  transaction,
  transactionRequest,
  updateSelectedAddress: updateSelectedAddressAction,
  updateValidationKeyAndSave: updateValidationKeyAndSaveAction,
  userHasBadAddress,
}) => {
  useEffect(() => {
    return () => {
      focusElement(`#${addressValidationType}-edit-link`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = useCallback(
    (address, addrSelectedId) => _event => {
      updateSelectedAddressAction(address, addrSelectedId);
    },
    [updateSelectedAddressAction],
  );

  const onEditClick = useCallback(
    () => {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'edit-link',
        'profile-section': analyticsSectionName,
      });
      openModalAction(addressValidationType, addressFromUser);
    },
    [
      analyticsSectionName,
      openModalAction,
      addressValidationType,
      addressFromUser,
    ],
  );

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      const payload = {
        ...selectedAddress,
        overrideValidationKey,
      };

      const suggestedAddressSelected = selectedAddressId !== 'userEntered';

      const method = payload.id ? 'PUT' : 'POST';

      if (userHasBadAddress) {
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
        updateValidationKeyAndSaveAction(
          VAP_SERVICE.API_ROUTES.ADDRESSES,
          method,
          addressValidationType,
          payload,
          analyticsSectionName,
        );
      } else {
        createTransactionAction(
          VAP_SERVICE.API_ROUTES.ADDRESSES,
          method,
          addressValidationType,
          payload,
          analyticsSectionName,
        );
      }
    },
    [
      selectedAddress,
      overrideValidationKey,
      selectedAddressId,
      userHasBadAddress,
      analyticsSectionName,
      updateValidationKeyAndSaveAction,
      addressValidationType,
      createTransactionAction,
    ],
  );

  const renderPrimaryButton = () => {
    let buttonText = 'Update';

    if (confirmedSuggestions.length === 0 && overrideValidationKey) {
      buttonText = 'Use this address';
    }

    if (confirmedSuggestions.length === 1 && !overrideValidationKey) {
      buttonText = 'Use suggested address';
    }

    if (
      addressValidationError ||
      (!confirmedSuggestions.length && !overrideValidationKey)
    ) {
      return (
        <button
          type="button"
          className="usa-button-primary"
          onClick={onEditClick}
        >
          Edit Address
        </button>
      );
    }

    return (
      <LoadingButton isLoading={isLoading} className="usa-button-primary">
        {buttonText}
      </LoadingButton>
    );
  };

  const renderAddressOption = (address, id = 'userEntered') => {
    const isAddressFromUser = id === 'userEntered';
    const hasConfirmedSuggestions =
      (confirmedSuggestions.length > 0 && overrideValidationKey) ||
      confirmedSuggestions.length > 1;
    const showEditLinkErrorState =
      addressValidationError && overrideValidationKey;
    const showEditLinkNonErrorState = !addressValidationError;
    const showEditLink = showEditLinkErrorState || showEditLinkNonErrorState;
    const isFirstOptionOrEnabled =
      (isAddressFromUser && overrideValidationKey) || !isAddressFromUser;

    const { street, cityStateZip, country } = formatAddress(address);

    return (
      <div
        key={id}
        className="vads-u-margin-bottom--1p5 address-validation-container"
      >
        {isFirstOptionOrEnabled &&
          hasConfirmedSuggestions && (
            <input
              type="radio"
              id={id}
              onChange={isFirstOptionOrEnabled && onChangeHandler(address, id)}
              checked={selectedAddressId === id}
            />
          )}
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

            {isAddressFromUser &&
              showEditLink && (
                <button
                  type="button"
                  className="va-button-link"
                  onClick={onEditClick}
                >
                  Edit Address
                </button>
              )}
          </div>
        </label>
      </div>
    );
  };

  const resetDataAndCloseModal = () => {
    resetAddressValidation();
    closeModalAction();
  };

  const validationMessageKey = getValidationMessageKey({
    suggestedAddresses,
    addressValidationError,
    confirmedSuggestions,
  });

  const addressValidationMessage =
    ADDRESS_VALIDATION_MESSAGES[validationMessageKey];

  const shouldShowSuggestions = confirmedSuggestions.length > 0;

  const error =
    transactionRequest?.error || (isFailedTransaction(transaction) ? {} : null);

  return (
    <VaModal
      modalTitle={
        addressValidationType.includes('mailing')
          ? 'Edit mailing address'
          : 'Edit home address'
      }
      id="address-validation-warning"
      onCloseEvent={resetDataAndCloseModal}
      visible
      uswds
    >
      {error && (
        <div className="vads-u-margin-bottom--1">
          <VAPServiceEditModalErrorMessage error={error} />
        </div>
      )}
      <VaAlert
        className="vads-u-margin-bottom--1"
        status="warning"
        headline={addressValidationMessage.headline}
        uswds
      >
        <addressValidationMessage.ModalText editFunction={onEditClick} />
      </VaAlert>
      <form onSubmit={onSubmit}>
        <span className="vads-u-font-weight--bold">You entered:</span>
        {renderAddressOption(addressFromUser)}
        {shouldShowSuggestions && (
          <span className="vads-u-font-weight--bold">Suggested Addresses:</span>
        )}
        {shouldShowSuggestions &&
          confirmedSuggestions.map((address, index) =>
            renderAddressOption(address, String(index)),
          )}
        {renderPrimaryButton()}
        <button
          type="button"
          className="usa-button-secondary"
          onClick={resetDataAndCloseModal}
        >
          Cancel
        </button>
      </form>
    </VaModal>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps;
  const { addressValidationType } = state.vapService.addressValidation;
  const userHasBadAddress = hasBadAddress(state);

  return {
    analyticsSectionName:
      VAP_SERVICE.ANALYTICS_FIELD_MAP[addressValidationType],
    isLoading:
      state.vapService.fieldTransactionMap[addressValidationType]?.isPending ||
      isPendingTransaction(transaction),
    addressValidationError:
      state.vapService.addressValidation.addressValidationError,
    suggestedAddresses: state.vapService.addressValidation.suggestedAddresses,
    confirmedSuggestions:
      state.vapService.addressValidation.confirmedSuggestions,
    addressValidationType,
    overrideValidationKey:
      state.vapService.addressValidation.overrideValidationKey,
    addressFromUser: state.vapService.addressValidation.addressFromUser,
    selectedAddress: state.vapService.addressValidation.selectedAddress,
    selectedAddressId: state.vapService.addressValidation.selectedAddressId,
    userHasBadAddress,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      closeModal,
      openModal,
      updateSelectedAddress,
      updateValidationKeyAndSave,
      createTransaction,
      resetAddressValidation: resetAddressValidationAction,
    },
    dispatch,
  ),
});

AddressValidationModal.propTypes = {
  addressFromUser: PropTypes.object.isRequired,
  addressValidationError: PropTypes.bool.isRequired,
  addressValidationType: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  resetAddressValidation: PropTypes.func.isRequired,
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
  selectedAddress: PropTypes.object,
  selectedAddressId: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
  userHasBadAddress: PropTypes.bool,
  overrideValidationKey: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
