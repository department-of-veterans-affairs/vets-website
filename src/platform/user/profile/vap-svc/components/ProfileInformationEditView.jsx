import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Toggler } from 'platform/utilities/feature-toggles';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { isEmptyAddress } from 'platform/forms/address/helpers';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { getFocusableElements } from 'platform/forms-system/src/js/utilities/ui';
import IntlMobileConfirmModal from '@@vap-svc/components/ContactInformationFieldInfo/IntlMobileConfirmModal';
import { dismissAlertViaCookie as dismissEmailConfirmationAlertViaCookie } from 'platform/mhv/components/MhvAlertConfirmEmail/selectors';
import { ContactInfoFormAppConfigContext } from './ContactInfoFormAppConfigContext';
import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  openModal,
  updateFormFieldWithSchema,
  validateAddress,
  openIntlMobileConfirmModal,
} from '../actions';

import {
  ACTIVE_EDIT_VIEWS,
  FIELD_NAMES,
  USA,
  PERSONAL_INFO_FIELD_NAMES,
  ANALYTICS_FIELD_MAP,
  API_ROUTES,
} from '../constants';

import {
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectEditViewData,
} from '../selectors';

import { recordCustomProfileEvent } from '../util/analytics';
import { transformInitialFormValues } from '../util/contact-information/formValues';
import {
  getErrorsFromDom,
  handleUpdateButtonClick,
} from '../util/contact-information/addressUtils';
import {
  isFailedTransaction,
  isPendingTransaction,
  isSuccessfulTransaction,
} from '../util/transactions';
import { getEditButtonId } from '../util/id-factory';

import CopyMailingAddress from '../containers/CopyMailingAddress';

import { createPersonalInfoUpdate } from '../actions/personalInformation';
import { createSchedulingPreferencesUpdate } from '../actions/schedulingPreferences';
import { updateMessagingSignature } from '../../actions/mhv';

import ProfileInformationActionButtons from './ProfileInformationActionButtons';
import { isSchedulingPreference } from '../util/health-care-settings/schedulingPreferencesUtils';

export class ProfileInformationEditView extends Component {
  componentDidMount() {
    const { getInitialFormValues } = this.props;

    this.onChangeFormDataAndSchemas(
      getInitialFormValues(),
      this.props.formSchema,
      this.props.uiSchema,
    );
    this.focusOnFirstFormElement();
  }

  componentDidUpdate(prevProps) {
    // Check if the cancel button should be focused before focusing
    // on the first form element
    if (
      this.props.shouldFocusCancelButton &&
      !prevProps.shouldFocusCancelButton
    ) {
      this.focusOnCancelButton();
    }

    if (!prevProps.field && !!this.props.field) {
      this.focusOnFirstFormElement();
    }

    const isAddressValidationError =
      this.props.transactionRequest?.error?.errors?.some(
        e => e.code === 'VET360_AV_ERROR',
      ) || false;

    // If we get an address validation error, open the validation modal
    if (
      isAddressValidationError &&
      !prevProps.transactionRequest?.error // Only trigger on new error
    ) {
      this.props.openModal(ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION);
    }

    if (
      !isAddressValidationError &&
      (this.props.transactionRequest?.error ||
        isFailedTransaction(this.props.transaction))
    ) {
      focusElement('button[aria-label="Close notification"]');
    }

    // if the transaction just became pending, start calling
    // refreshTransaction() on an interval
    if (
      isPendingTransaction(this.props.transaction) &&
      !isPendingTransaction(prevProps.transaction)
    ) {
      this.interval = window.setInterval(
        this.refreshTransaction,
        window.VetsGov.pollTimeout || 2000,
      );
    }
    // if the transaction is no longer pending, stop refreshing it
    if (
      isPendingTransaction(prevProps.transaction) &&
      !isPendingTransaction(this.props.transaction)
    ) {
      window.clearInterval(this.interval);

      // Dismiss the MHV email confirmation alert if email transaction succeeded
      // This handles cases where the component stays mounted after transaction completion
      if (
        this.props.fieldName === FIELD_NAMES.EMAIL &&
        this.props.transaction &&
        isSuccessfulTransaction(this.props.transaction)
      ) {
        dismissEmailConfirmationAlertViaCookie();
      }
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }

    const { fieldName } = this.props;

    // Errors returned directly from the API request (as opposed through a transaction lookup) are
    // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
    // for the next time the modal is opened by removing any existing transaction request from the store.
    if (this.props.transactionRequest?.error) {
      this.props.clearTransactionRequest(fieldName);
    } else if (
      // Dismiss the MHV email confirmation alert if email transaction succeeded
      // This is a fallback for cases where componentDidUpdate doesn't run
      // (e.g., when the component unmounts immediately after transaction completion)
      fieldName === FIELD_NAMES.EMAIL &&
      this.props.transactionRequest &&
      !this.props.transactionRequest.isPending
    ) {
      dismissEmailConfirmationAlertViaCookie();
    }

    // AS DONE IN ADDRESSEDITVIEW, CHECK FOR CORRECTNESS
    if (fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS) {
      focusElement(`#${getEditButtonId(fieldName)}`);
    }
  }

  // 48147 - Temporary click handler that will be removed once the analytics stats have been gathered around
  // multiple inline validation errors.
  onClickUpdateHandler = () => {
    handleUpdateButtonClick(
      getErrorsFromDom,
      this.props.fieldName,
      recordCustomProfileEvent,
    );
  };

  copyMailingAddress = mailingAddress => {
    const newAddressValue = { ...this.props.field.value, ...mailingAddress };
    this.onChangeFormDataAndSchemas(
      transformInitialFormValues(newAddressValue),
      this.props.field.formSchema,
      this.props.field.uiSchema,
    );
  };

  refreshTransaction = () => {
    this.props.refreshTransaction(
      this.props.transaction,
      this.props.analyticsSectionName,
    );
  };

  onSubmit = () => {
    const {
      convertCleanDataToPayload,
      fieldName,
      analyticsSectionName,
      apiRoute,
      field,
    } = this.props;
    const isAddressField = fieldName.toLowerCase().includes('address');
    if (!isAddressField) {
      this.captureEvent('update-button');
    }

    let payload = field.value;
    if (convertCleanDataToPayload) {
      payload = convertCleanDataToPayload(payload, fieldName);
    }

    // for personal info fields we are using a different request flow
    if (Object.values(PERSONAL_INFO_FIELD_NAMES).includes(fieldName)) {
      // personal info updates require a value
      // this is a fix for blur validation bug
      if (
        fieldName === PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME &&
        !field.value?.[PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME]
      ) {
        field.formSchema.required = [fieldName];
        this.onChangeFormDataAndSchemas(
          field.value,
          field.formSchema,
          field.uiSchema,
        );
        return;
      }

      if (fieldName === PERSONAL_INFO_FIELD_NAMES.MESSAGING_SIGNATURE) {
        this.props.updateMessagingSignature(payload, fieldName, 'POST');
        return;
      }

      this.props.createPersonalInfoUpdate({
        route: apiRoute,
        method: 'PUT',
        fieldName,
        payload,
        analyticsSectionName,
        value: field.value,
      });
      return;
    }

    if (isSchedulingPreference(fieldName)) {
      this.props.createSchedulingPreferencesUpdate({
        route: apiRoute,
        method: 'POST',
        fieldName,
        payload,
        analyticsSectionName,
        value: field.value,
      });
      return;
    }

    const method = payload?.id ? 'PUT' : 'POST';

    if (isAddressField) {
      this.props.validateAddress(
        apiRoute,
        method,
        fieldName,
        payload,
        analyticsSectionName,
      );
      return;
    }

    const createTransactionFn = () => {
      this.props.createTransaction(
        apiRoute,
        method,
        fieldName,
        payload,
        analyticsSectionName,
      );
    };

    // Show a confirmation modal before saving internation mobile numbers
    // Relay the transaction to the confirmation modal
    // `countryCode == 1` is marked as international, skip that case
    if (
      fieldName === 'mobilePhone' &&
      payload.isInternational &&
      String(payload.countryCode) !== USA.COUNTRY_CODE
    ) {
      this.props.openIntlMobileConfirmModal(
        payload.countryCode,
        payload.phoneNumber,
        createTransactionFn,
      );
      return;
    }

    createTransactionFn();
  };

  onInput = (value, schema, uiSchema) => {
    const addressFieldNames = [
      FIELD_NAMES.MAILING_ADDRESS,
      FIELD_NAMES.RESIDENTIAL_ADDRESS,
    ];

    if (!addressFieldNames.includes(this.props.fieldName)) {
      this.onChangeFormDataAndSchemas(value, schema, uiSchema);
    }

    const newFieldValue = {
      ...value,
    };
    if (newFieldValue['view:livesOnMilitaryBase']) {
      newFieldValue.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;
    }

    this.onChangeFormDataAndSchemas(newFieldValue, schema, uiSchema);
  };

  onChangeFormDataAndSchemas = (value, schema, uiSchema) => {
    // Validate before updating

    this.props.updateFormFieldWithSchema(
      this.props.fieldName,
      value,
      schema,
      uiSchema,
    );
  };

  captureEvent(actionName) {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': this.props.analyticsSectionName,
    });
  }

  focusOnFirstFormElement() {
    if (this.props.forceEditView) {
      // Showing the edit view on its own page, so let the app handle focus
      return;
    }

    if (this.editForm) {
      setTimeout(() => {
        // Set focus on the country picker if we're using the va-telephone-input component
        const vaTel = this.editForm?.querySelector?.('va-telephone-input');
        const vaComboBox = vaTel?.shadowRoot?.querySelector?.('va-combo-box');
        const countrySelect = vaComboBox?.shadowRoot?.querySelector?.('input');

        if (vaTel && countrySelect) {
          countrySelect.focus();
        } else {
          // If no va-telephone-input, focus the first focusable element in the form
          const focusableElement = getFocusableElements(this.editForm)?.[0];

          if (focusableElement) {
            focusElement(focusableElement);
          }
        }
      }, 100);
    }
  }

  // We manually set focus on the cancel button when the confirm cancel modal is closed
  // Since va-button is a web component, we need to wait for the shadow DOM to render
  // before we can focus the native button inside it
  focusOnCancelButton() {
    setTimeout(() => {
      const cancelButton = this.editForm?.querySelector(
        'va-button[data-testid="cancel-edit-button"]',
      );
      if (cancelButton && cancelButton.shadowRoot) {
        const shadowButton = cancelButton.shadowRoot.querySelector('button');
        if (shadowButton) shadowButton.focus();
      }
      if (this.props.onCancelButtonFocused) {
        this.props.onCancelButtonFocused();
      }
    }, 100);
  }

  render() {
    const {
      onSubmit,
      props: {
        analyticsSectionName,
        field,
        fieldName,
        onCancel,
        title,
        transaction,
        transactionRequest,
        cancelButtonText,
        saveButtonText,
        intlMobileConfirmModalEnabled,
      },
      onClickUpdateHandler,
    } = this;

    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);

    const isResidentialAddress = fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS;

    const formData =
      this.context?.formFieldData?.formOnlyUpdate === true
        ? (() => {
            // Merge objects but also handle inputPhoneNumber explicitly
            const merged = {
              ...field.value,
              ...this.context.formFieldData,
            };
            // For phone fields, ensure inputPhoneNumber is updated to match the new number
            if (
              [FIELD_NAMES.HOME_PHONE, FIELD_NAMES.MOBILE_PHONE].includes(
                fieldName,
              ) &&
              this.context.formFieldData?.phoneNumber
            ) {
              merged.inputPhoneNumber =
                this.context.formFieldData.areaCode +
                this.context.formFieldData.phoneNumber;
            }
            return merged;
          })()
        : field?.value;

    return (
      <>
        {!!field && (
          <div
            ref={el => {
              this.editForm = el;
            }}
          >
            {isResidentialAddress && (
              <CopyMailingAddress
                copyMailingAddress={this.copyMailingAddress}
              />
            )}

            <SchemaForm
              addNameAttribute
              // `name` and `title` are required by SchemaForm, but are only used
              // internally by the SchemaForm component
              name="Contact Info Form"
              title="Contact Info Form"
              schema={field.formSchema}
              data={formData}
              uiSchema={field.uiSchema}
              onChange={event =>
                this.onInput(event, field.formSchema, field.uiSchema)
              }
              onSubmit={onSubmit}
            >
              {fieldName === FIELD_NAMES.MOBILE_PHONE &&
                this.props.allowInternationalPhones && (
                  <Toggler.Hoc
                    toggleName={
                      Toggler.TOGGLE_NAMES.profileInternationalPhoneNumbers
                    }
                  >
                    {toggleValue =>
                      toggleValue ? (
                        <p>
                          Enter a U.S. mobile phone number to receive text
                          notifications. We can’t send text notifications to
                          international numbers.
                        </p>
                      ) : null
                    }
                  </Toggler.Hoc>
                )}
              <ProfileInformationActionButtons
                onCancel={onCancel}
                title={title}
                analyticsSectionName={analyticsSectionName}
                isLoading={isLoading}
              >
                <div className="vads-u-display--block mobile-lg:vads-u-display--flex">
                  <va-button
                    data-action="save-edit"
                    data-testid="save-edit-button"
                    loading={isLoading}
                    submit="prevent"
                    onClick={onClickUpdateHandler}
                    text={isLoading ? '' : saveButtonText || 'Save'}
                    class="vads-u-margin-top--1 vads-u-margin-bottom--1 vads-u-width--full mobile-lg:vads-u-width--auto"
                  />

                  {!isLoading && (
                    <va-button
                      data-testid="cancel-edit-button"
                      onClick={onCancel}
                      text={cancelButtonText || 'Cancel'}
                      class="vads-u-margin-top--1 vads-u-width--full mobile-lg:vads-u-width--auto"
                      secondary
                    />
                  )}
                </div>
              </ProfileInformationActionButtons>
            </SchemaForm>
          </div>
        )}
        {intlMobileConfirmModalEnabled && <IntlMobileConfirmModal />}
      </>
    );
  }
}

ProfileInformationEditView.propTypes = {
  analyticsSectionName: PropTypes.oneOf(Object.values(ANALYTICS_FIELD_MAP))
    .isRequired,
  apiRoute: PropTypes.oneOf(Object.values(API_ROUTES)).isRequired,
  clearTransactionRequest: PropTypes.func.isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  createPersonalInfoUpdate: PropTypes.func.isRequired,
  createSchedulingPreferencesUpdate: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  fieldName: PropTypes.oneOf(Object.values(FIELD_NAMES)).isRequired,
  formSchema: PropTypes.object.isRequired,
  getInitialFormValues: PropTypes.func.isRequired,
  openIntlMobileConfirmModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  recordCustomProfileEvent: PropTypes.func.isRequired,
  refreshTransaction: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  updateFormFieldWithSchema: PropTypes.func.isRequired,
  validateAddress: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  activeEditView: PropTypes.string,
  allowInternationalPhones: PropTypes.bool,
  cancelButtonText: PropTypes.string,
  contactInfoFormAppConfig: PropTypes.object,
  data: PropTypes.object,
  editViewData: PropTypes.object,
  field: PropTypes.shape({
    value: PropTypes.object,
    validations: PropTypes.object,
    formSchema: PropTypes.object,
    uiSchema: PropTypes.object,
  }),
  forceEditView: PropTypes.bool,
  intlMobileConfirmModalEnabled: PropTypes.bool,
  saveButtonText: PropTypes.string,
  shouldFocusCancelButton: PropTypes.bool,
  successCallback: PropTypes.func,
  title: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
  updateMessagingSignature: PropTypes.func,
  onCancelButtonFocused: PropTypes.func,
};

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    fieldName,
  );
  const data = selectVAPContactInfoField(state, fieldName);
  // const addressValidationType = selectAddressValidationType(state);
  const activeEditView = selectCurrentlyOpenEditModal(state);

  const mailingAddress = selectVAPContactInfoField(
    state,
    FIELD_NAMES.MAILING_ADDRESS,
  );

  return {
    /*
        This ternary is to deal with an edge case: if the user is currently viewing
        the address validation view we need to handle things differently or text in
        the modal would be inaccurate. This is an unfortunate hack to get around an
        existing hack we've been using to determine if we need to show the address
        validation view or not.
        */
    activeEditView:
      activeEditView === ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION
        ? ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION
        : selectCurrentlyOpenEditModal(state),
    data,
    fieldName,
    analyticsSectionName: ANALYTICS_FIELD_MAP[fieldName],
    field: selectEditedFormField(state, fieldName),
    transaction,
    transactionRequest,
    editViewData: selectEditViewData(state),
    emptyMailingAddress: isEmptyAddress(mailingAddress),
    intlMobileConfirmModalEnabled:
      // Optional chains since test contexts might not provide the objects
      state?.vapService?.intlMobileConfirmModal?.isOpen || false,
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  createTransaction,
  openModal,
  updateFormFieldWithSchema,
  validateAddress,
  refreshTransaction,
  createPersonalInfoUpdate,
  createSchedulingPreferencesUpdate,
  updateMessagingSignature,
  openIntlMobileConfirmModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileInformationEditView);

ProfileInformationEditView.contextType = ContactInfoFormAppConfigContext;
