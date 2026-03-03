import React, { useContext, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaAlert,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isPendingTransaction } from 'platform/user/profile/vap-svc/util/transactions';
import {
  hasBadAddress,
  selectAddressValidation,
} from 'platform/user/profile/vap-svc/selectors';
import { formatAddress } from 'platform/forms/address/helpers';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement, waitForRenderThenFocus } from 'platform/utilities/ui';
import { setData } from 'platform/forms-system/exportsFile';
import { ContactInfoFormAppConfigContext } from '../components/ContactInfoFormAppConfigContext';
import * as VAP_SERVICE from '../constants';
import {
  clearAddressValidationKey,
  closeModal,
  createTransaction,
  openModal,
  resetAddressValidation as resetAddressValidationAction,
  updateSelectedAddress,
  updateValidationKeyAndSave,
} from '../actions';
import { getValidationMessageKey } from '../util';
import { ADDRESS_VALIDATION_MESSAGES } from '../constants/addressValidationMessages';
import { formatDisplayAddressInRadio } from '../util/contact-information/addressUtils';

const AddressValidationView = ({
  addressFromUser,
  addressValidationError,
  addressValidationErrorCode,
  addressValidationType,
  analyticsSectionName,
  clearAddressValidationKey: clearAddressValidationKeyAction,
  confirmedSuggestions,
  createTransaction: createTransactionAction,
  isLoading,
  isNoValidationKeyAlertEnabled,
  openModal: openModalAction,
  overrideValidationKey,
  refreshTransaction: refreshTransactionProp,
  selectedAddress,
  selectedAddressId,
  successCallback,
  suggestedAddresses,
  transaction,
  transactionError,
  updateSelectedAddress: updateSelectedAddressAction,
  updateValidationKeyAndSave: updateValidationKeyAndSaveAction,
  userHasBadAddress,
  vapServiceFormFields,
}) => {
  const context = useContext(ContactInfoFormAppConfigContext);
  const intervalRef = useRef(null);

  // using the context so we can get the right fieldName to access
  // the updateProfileChoice in the vapService.formFields state
  const updateProfileChoice =
    context?.fieldName &&
    vapServiceFormFields?.[context?.fieldName]?.value?.updateProfileChoice;

  useEffect(() => {
    // scroll on the alert since the web component doesn't have a focus/auto-scroll method built in like the React component
    waitForRenderThenFocus('#address-validation-alert-heading');
  }, []);

  useEffect(
    () => {
      // if the transaction just became pending, start calling the
      // refreshTransaction() on an interval
      if (isPendingTransaction(transaction)) {
        if (!intervalRef.current) {
          intervalRef.current = window.setInterval(
            refreshTransactionProp,
            window.VetsGov.pollTimeout || 1000,
          );
        }
      } else if (intervalRef.current) {
        // if the transaction is no longer pending, stop refreshing it
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    [transaction, refreshTransactionProp],
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      focusElement(`#${addressValidationType}-edit-link`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeSelectedAddress = useCallback(
    (address, addrSelectedId) => {
      let newSelectedAddress = {};
      if (addrSelectedId !== 'userEntered') {
        // if the user selected a suggested address, grab that address from the confirmedSuggestions prop
        newSelectedAddress = confirmedSuggestions[parseInt(addrSelectedId, 10)];
      } else {
        newSelectedAddress = address;
      }
      updateSelectedAddressAction(newSelectedAddress, addrSelectedId);
    },
    [confirmedSuggestions, updateSelectedAddressAction],
  );

  const requiresNewValidationKey = useCallback(payload => {
    const { addressMetaData, overrideValidationKey: overrideKey } = payload;
    if (overrideKey) {
      // if there is a overrideValidationKey, assume the overrideValidationKey is already updated
      return false;
    }
    if (
      (addressMetaData?.addressType?.toUpperCase() === 'DOMESTIC' ||
        addressMetaData?.addressType?.toUpperCase() === 'MILITARY' ||
        addressMetaData?.addressType?.toUpperCase() === 'OVERSEAS MILITARY') &&
      addressMetaData?.confidenceScore < 80
    ) {
      return true;
    }
    return (
      addressMetaData?.addressType?.toUpperCase() === 'INTERNATIONAL' &&
      addressMetaData?.confidenceScore < 70
    );
  }, []);

  const onEditClick = useCallback(
    () => {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'edit-link',
        'profile-section': analyticsSectionName,
      });

      // adding the updateProfileChoice to the addressFromUser object so that
      // the radio button on address form can be set correctly for new edits
      openModalAction(addressValidationType, {
        ...addressFromUser,
        updateProfileChoice,
      });
    },
    [
      analyticsSectionName,
      openModalAction,
      addressValidationType,
      addressFromUser,
      updateProfileChoice,
    ],
  );

  const onSubmit = useCallback(
    async event => {
      event.preventDefault();

      const payload = {
        ...selectedAddress,
        overrideValidationKey,
      };

      if (context?.prefillPatternEnabled) {
        const shouldOnlyUpdateForm = updateProfileChoice === 'no';

        if (shouldOnlyUpdateForm) {
          // using this context allows us to get the initial formKey and keys that may
          // potentially be customized when the main profileContactInfo factory function is used
          const { updateContactInfoForFormApp, fieldName } = context;

          updateContactInfoForFormApp(fieldName, payload, updateProfileChoice);

          // this should cause navigation back to the ContactInfo page
          successCallback();

          openModalAction();
          return;
        }
      }

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
        // if the user selected a suggested address, we need to remove the overrideValidationKey
        // so that the API doesn't throw an error
        delete payload.overrideValidationKey;
        clearAddressValidationKeyAction();
      }
      if (requiresNewValidationKey(payload)) {
        // if the suggested address selected, there will be no overrideValidationKey so if the
        // address has a low confidence rating we need to fetch a new overrideValidationKey for
        // the update request
        await updateValidationKeyAndSaveAction(
          VAP_SERVICE.API_ROUTES.ADDRESSES,
          method,
          addressValidationType,
          payload,
          analyticsSectionName,
        );
      } else {
        await createTransactionAction(
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
      context,
      updateProfileChoice,
      successCallback,
      openModalAction,
      selectedAddressId,
      userHasBadAddress,
      analyticsSectionName,
      clearAddressValidationKeyAction,
      requiresNewValidationKey,
      updateValidationKeyAndSaveAction,
      addressValidationType,
      createTransactionAction,
    ],
  );

  const renderPrimaryButton = () => {
    let buttonText = 'Use address you entered';

    if (confirmedSuggestions.length === 0 && overrideValidationKey) {
      buttonText = 'Use address you entered';
    }

    if (
      confirmedSuggestions.length === 1 &&
      selectedAddressId !== 'userEntered'
    ) {
      buttonText = 'Use suggested address';
    }

    if (
      addressValidationError ||
      (!confirmedSuggestions.length && !overrideValidationKey)
    ) {
      return (
        <va-button
          data-testid="edit-address-button"
          onClick={onEditClick}
          label="Edit address"
          text="Edit"
          class="vads-u-margin-top--1 vads-u-width--full mobile-lg:vads-u-width--auto"
        />
      );
    }

    return (
      <va-button
        data-testid="confirm-address-button"
        loading={isLoading}
        submit="prevent"
        text={isLoading ? '' : buttonText}
        class="vads-u-margin-top--1 vads-u-margin-bottom--1 vads-u-width--full mobile-lg:vads-u-width--auto"
      />
    );
  };

  const renderAddressOption = (address, id = 'userEntered') => {
    const isAddressFromUser = id === 'userEntered';
    const hasConfirmedSuggestions =
      (confirmedSuggestions.length > 0 && overrideValidationKey) ||
      confirmedSuggestions.length > 1;
    const isFirstOptionOrEnabled =
      (isAddressFromUser && overrideValidationKey) || !isAddressFromUser;

    const { street, cityStateZip, country } = formatAddress(address);
    const puralizedAddress =
      confirmedSuggestions.length > 1
        ? 'Suggested addresses:'
        : 'Suggested address:';

    return (
      <div key={id} className="address-validation-container">
        {isFirstOptionOrEnabled && hasConfirmedSuggestions ? (
          <VaRadio
            data-testid="va-radio-label"
            label={
              id === 'userEntered' ? 'Address you entered:' : puralizedAddress
            }
            labelHeaderLevel={5}
            onVaValueChange={event => {
              onChangeSelectedAddress(address, event.detail.value);
            }}
            className={
              id === 'userEntered'
                ? 'vads-u-margin-top--12'
                : 'vads-u-margin-top--2'
            }
          >
            {id === 'userEntered' ? (
              <va-radio-option
                data-testid="userEnteredAddressOption"
                style={{ whiteSpace: 'pre-line' }}
                key="userAddress"
                name="addressGroup"
                label={formatDisplayAddressInRadio(address)}
                description={(street, cityStateZip, country)}
                value="userEntered"
                checked={selectedAddressId === id}
              />
            ) : (
              confirmedSuggestions.map((suggestedAddress, index) => (
                <va-radio-option
                  data-testid="suggestedAddressOption"
                  style={{ whiteSpace: 'pre-line' }}
                  key="suggestedAddress"
                  name="addressGroup"
                  label={formatDisplayAddressInRadio(suggestedAddress)}
                  description={(street, cityStateZip, country)}
                  value={index}
                  checked={selectedAddressId === index.toString()}
                />
              ))
            )}
          </VaRadio>
        ) : (
          <>
            <h5 className="vads-u-margin-top--3 vads-u-padding-top--0">
              Address you entered:
            </h5>
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-bottom--1p5">
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
          </>
        )}
      </div>
    );
  };

  const validationMessageKey = getValidationMessageKey({
    suggestedAddresses,
    addressValidationError,
    confirmedSuggestions,
    overrideValidationKey,
    addressValidationErrorCode,
    isNoValidationKeyAlertEnabled, // remove when profileShowNoValidationKeyAddressAlert flag is retired
  });

  const addressValidationMessage =
    ADDRESS_VALIDATION_MESSAGES[validationMessageKey];

  const shouldShowSuggestions =
    confirmedSuggestions && confirmedSuggestions.length > 0;

  return (
    <>
      {/*
      Show the address validation alert when there is no service transaction error.
      A transaction error alert will appear in the element position right before this component and
      under the field component header.
      */}
      {!transactionError && (
        <VaAlert
          className="vads-u-margin-bottom--1 vads-u-margin-top--0"
          status={addressValidationError ? 'error' : 'warning'}
          visible
          slim={addressValidationMessage?.slim}
          role="alert"
        >
          {addressValidationMessage.headline && (
            <h4 id="address-validation-alert-heading" slot="headline">
              {addressValidationMessage.headline}
            </h4>
          )}
          <addressValidationMessage.ModalText editFunction={onEditClick} />
        </VaAlert>
      )}
      <form onSubmit={onSubmit}>
        {renderAddressOption(addressFromUser)}
        {shouldShowSuggestions && renderAddressOption({}, 'suggested')}

        <div className="vads-u-display--flex mobile-lg:vads-u-display--block vads-u-flex-direction--column">
          {renderPrimaryButton()}
          {!addressValidationError &&
            !isLoading && (
              <va-button
                data-testid="edit-address-button"
                onClick={onEditClick}
                label="Edit address"
                text="Edit"
                class="vads-u-margin-top--1 vads-u-width--full mobile-lg:vads-u-width--auto"
                secondary
              />
            )}
        </div>
      </form>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps;
  const vapServiceFormFields = state.vapService?.formFields;
  const formAppData = state?.form?.data;

  const {
    addressFromUser,
    addressValidationError,
    addressValidationErrorCode,
    addressValidationType,
    confirmedSuggestions,
    selectedAddress,
    selectedAddressId,
    suggestedAddresses,
    overrideValidationKey,
  } = selectAddressValidation(state);
  const userHasBadAddress = hasBadAddress(state);
  const isNoValidationKeyAlertEnabled =
    state.featureToggles?.profileShowNoValidationKeyAddressAlert; // remove when profileShowNoValidationKeyAddressAlert flag is retired
  return {
    vapServiceFormFields,
    formAppData,
    analyticsSectionName:
      VAP_SERVICE.ANALYTICS_FIELD_MAP[addressValidationType],
    isLoading:
      state.vapService.fieldTransactionMap[addressValidationType]?.isPending ||
      isPendingTransaction(transaction),
    addressFromUser,
    addressValidationError,
    addressValidationErrorCode,
    addressValidationType,
    confirmedSuggestions,
    selectedAddress,
    selectedAddressId,
    suggestedAddresses,
    userHasBadAddress,
    overrideValidationKey,
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
  clearAddressValidationKey,
  setDataAction: setData,
};

AddressValidationView.propTypes = {
  addressFromUser: PropTypes.object.isRequired,
  addressValidationError: PropTypes.bool.isRequired,
  addressValidationType: PropTypes.string.isRequired,
  clearAddressValidationKey: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  resetAddressValidation: PropTypes.func.isRequired,
  setDataAction: PropTypes.func.isRequired,
  suggestedAddresses: PropTypes.array.isRequired,
  updateSelectedAddress: PropTypes.func.isRequired,
  updateValidationKeyAndSave: PropTypes.func.isRequired,
  addressValidationErrorCode: PropTypes.string,
  analyticsSectionName: PropTypes.string,
  confirmedSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      addressLine1: PropTypes.string.isRequired,
      addressType: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      countryName: PropTypes.string.isRequired,
      countryCodeIso3: PropTypes.string.isRequired,
      countyCode: PropTypes.string,
      countyName: PropTypes.string.isRequired,
      stateCode: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      addressPou: PropTypes.string.isRequired,
    }),
  ),
  formAppData: PropTypes.object,
  isLoading: PropTypes.bool,
  isNoValidationKeyAlertEnabled: PropTypes.bool,
  overrideValidationKey: PropTypes.number,
  refreshTransaction: PropTypes.func,
  selectedAddress: PropTypes.object,
  selectedAddressId: PropTypes.string,
  successCallback: PropTypes.func,
  transactionError: PropTypes.shape({
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        message: PropTypes.string,
      }),
    ),
  }),
  userHasBadAddress: PropTypes.bool,
  vapServiceFormFields: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationView);
