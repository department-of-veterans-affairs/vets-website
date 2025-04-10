import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaAlert,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
import { setData } from 'platform/forms-system/exportsFile';
import { ContactInfoFormAppConfigContext } from '../components/ContactInfoFormAppConfigContext';
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
import { formatDisplayAddressInRadio } from '../util/contact-information/addressUtils';

class AddressValidationView extends React.Component {
  // using the context so we can get the right fieldName to access
  // the updateProfileChoice in the vapService.formFields state
  updateProfileChoice =
    this.context?.fieldName &&
    this.props.vapServiceFormFields[(this.context?.fieldName)]?.value
      ?.updateProfileChoice;

  componentDidMount() {
    // scroll on the alert since the web component doesn't have a focus/auto-scroll method built in like the React component
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

    if (this.context?.prefillPatternEnabled) {
      const shouldOnlyUpdateForm = this.updateProfileChoice === 'no';

      if (shouldOnlyUpdateForm) {
        // using this context allows us to get the initial formKey and keys that may
        // potentially be customized when the main profileContactInfo factory function is used
        const { updateContactInfoForFormApp, fieldName } = this.context;

        updateContactInfoForFormApp(
          fieldName,
          payload,
          this.updateProfileChoice,
        );

        // this should cause navigation back to the ContactInfo page
        this.props.successCallback();

        this.props.openModal();
        return;
      }
    }

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

    // adding the updateProfileChoice to the addressFromUser object so that
    // the radio button on address form can be set correctly for new edits
    this.props.openModal(addressValidationType, {
      ...addressFromUser,
      updateProfileChoice: this.updateProfileChoice,
    });
  };

  renderPrimaryButton = () => {
    const {
      addressValidationError,
      validationKey,
      isLoading,
      confirmedSuggestions,
      selectedAddressId,
    } = this.props;

    let buttonText = 'Use address you entered';

    if (confirmedSuggestions.length === 0 && validationKey) {
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
              this.onChangeSelectedAddress(address, event.detail.value);
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

    const shouldShowSuggestions =
      confirmedSuggestions && confirmedSuggestions.length > 0;

    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    return (
      <>
        <div role="alert">
          <VaAlert
            className="vads-u-margin-bottom--1 vads-u-margin-top--0"
            status={addressValidationError ? 'error' : 'warning'}
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
          {this.renderAddressOption(addressFromUser)}
          {shouldShowSuggestions && this.renderAddressOption('', 'suggested')}
          {error && (
            <div className="vads-u-margin-bottom--1" role="alert">
              <VAPServiceEditModalErrorMessage error={error} />
            </div>
          )}

          <div className="vads-u-display--flex mobile-lg:vads-u-display--block vads-u-flex-direction--column">
            {this.renderPrimaryButton()}
            {!addressValidationError &&
              !isLoading && (
                <button
                  type="button"
                  className="usa-button-secondary vads-u-margin-top--1p4 mobile-lg:vads-u-margin-top--1p5 vads-u-width--full mobile-lg:vads-u-width--auto"
                  onClick={this.onEditClick}
                >
                  Edit address
                </button>
              )}
          </div>
        </form>
      </>
    );
  }
}

AddressValidationView.contextType = ContactInfoFormAppConfigContext;

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps;
  const vapServiceFormFields = state.vapService?.formFields;
  const formAppData = state?.form?.data;

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
    vapServiceFormFields,
    formAppData,
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
  setDataAction: setData,
};

AddressValidationView.propTypes = {
  addressFromUser: PropTypes.object.isRequired,
  addressValidationError: PropTypes.bool.isRequired,
  addressValidationType: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  setDataAction: PropTypes.func.isRequired,
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
  formAppData: PropTypes.object,
  isLoading: PropTypes.bool,
  isNoValidationKeyAlertEnabled: PropTypes.bool,
  refreshTransaction: PropTypes.func,
  selectedAddress: PropTypes.object,
  selectedAddressId: PropTypes.string,
  successCallback: PropTypes.func,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
  userHasBadAddress: PropTypes.bool,
  validationKey: PropTypes.number,
  vapServiceFormFields: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationView);
