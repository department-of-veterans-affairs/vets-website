import React, { useEffect, useRef, useCallback, useContext } from 'react';
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

export const ProfileInformationEditView = props => {
  const {
    analyticsSectionName,
    apiRoute,
    cancelButtonText,
    clearTransactionRequest: clearTransactionRequestAction,
    convertCleanDataToPayload,
    createPersonalInfoUpdate: createPersonalInfoUpdateAction,
    createSchedulingPreferencesUpdate: createSchedulingPreferencesUpdateAction,
    createTransaction: createTransactionAction,
    field,
    fieldName,
    forceEditView,
    formSchema,
    getInitialFormValues,
    intlMobileConfirmModalEnabled,
    onCancel,
    onCancelButtonFocused,
    openIntlMobileConfirmModal: openIntlMobileConfirmModalAction,
    openModal: openModalAction,
    refreshTransaction: refreshTransactionAction,
    saveButtonText,
    shouldFocusCancelButton,
    title,
    transaction,
    transactionRequest,
    uiSchema,
    updateFormFieldWithSchema: updateFormFieldWithSchemaAction,
    updateMessagingSignature: updateMessagingSignatureAction,
    validateAddress: validateAddressAction,
    allowInternationalPhones,
  } = props;

  const context = useContext(ContactInfoFormAppConfigContext);
  const editFormRef = useRef(null);
  const intervalRef = useRef(null);
  const prevFieldRef = useRef(field);
  const prevTransactionRef = useRef(transaction);
  const prevTransactionRequestRef = useRef(transactionRequest);
  const prevShouldFocusCancelButtonRef = useRef(shouldFocusCancelButton);

  const onChangeFormDataAndSchemas = useCallback(
    (value, schema, uiSchemaVal) => {
      updateFormFieldWithSchemaAction(fieldName, value, schema, uiSchemaVal);
    },
    [fieldName, updateFormFieldWithSchemaAction],
  );

  const focusOnFirstFormElement = useCallback(
    () => {
      if (forceEditView) {
        // Showing the edit view on its own page, so let the app handle focus
        return;
      }

      if (editFormRef.current) {
        setTimeout(() => {
          // Set focus on the country picker if we're using the va-telephone-input component
          const vaTel = editFormRef.current?.querySelector?.(
            'va-telephone-input',
          );
          const vaComboBox = vaTel?.shadowRoot?.querySelector?.('va-combo-box');
          const countrySelect = vaComboBox?.shadowRoot?.querySelector?.(
            'input',
          );

          if (vaTel && countrySelect) {
            countrySelect.focus();
          } else {
            // If no va-telephone-input, focus the first focusable element in the form
            const focusableElement = getFocusableElements(
              editFormRef.current,
            )?.[0];

            if (focusableElement) {
              focusElement(focusableElement);
            }
          }
        }, 100);
      }
    },
    [forceEditView],
  );

  // We manually set focus on the cancel button when the confirm cancel modal is closed
  // Since va-button is a web component, we need to wait for the shadow DOM to render
  // before we can focus the native button inside it
  const focusOnCancelButton = useCallback(
    () => {
      setTimeout(() => {
        const cancelButton = editFormRef.current?.querySelector(
          'va-button[data-testid="cancel-edit-button"]',
        );
        if (cancelButton && cancelButton.shadowRoot) {
          const shadowButton = cancelButton.shadowRoot.querySelector('button');
          if (shadowButton) shadowButton.focus();
        }
        if (onCancelButtonFocused) {
          onCancelButtonFocused();
        }
      }, 100);
    },
    [onCancelButtonFocused],
  );

  const doRefreshTransaction = useCallback(
    () => {
      refreshTransactionAction(transaction, analyticsSectionName);
    },
    [refreshTransactionAction, transaction, analyticsSectionName],
  );

  // componentDidMount
  useEffect(() => {
    onChangeFormDataAndSchemas(getInitialFormValues(), formSchema, uiSchema);
    focusOnFirstFormElement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // componentDidUpdate logic
  useEffect(() => {
    // Check if the cancel button should be focused
    if (shouldFocusCancelButton && !prevShouldFocusCancelButtonRef.current) {
      focusOnCancelButton();
    }

    if (!prevFieldRef.current && !!field) {
      focusOnFirstFormElement();
    }

    const isAddressValidationError =
      transactionRequest?.error?.errors?.some(
        e => e.code === 'VET360_AV_ERROR',
      ) || false;

    // If we get an address validation error, open the validation modal
    if (
      isAddressValidationError &&
      !prevTransactionRequestRef.current?.error // Only trigger on new error
    ) {
      openModalAction(ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION);
    }

    if (
      !isAddressValidationError &&
      (transactionRequest?.error || isFailedTransaction(transaction))
    ) {
      focusElement('button[aria-label="Close notification"]');
    }

    // if the transaction just became pending, start calling
    // refreshTransaction() on an interval
    if (
      isPendingTransaction(transaction) &&
      !isPendingTransaction(prevTransactionRef.current)
    ) {
      intervalRef.current = window.setInterval(
        doRefreshTransaction,
        window.VetsGov.pollTimeout || 2000,
      );
    }
    // if the transaction is no longer pending, stop refreshing it
    if (
      isPendingTransaction(prevTransactionRef.current) &&
      !isPendingTransaction(transaction)
    ) {
      window.clearInterval(intervalRef.current);

      // Dismiss the MHV email confirmation alert if email transaction succeeded
      if (
        fieldName === FIELD_NAMES.EMAIL &&
        transaction &&
        isSuccessfulTransaction(transaction)
      ) {
        dismissEmailConfirmationAlertViaCookie();
      }
    }

    prevFieldRef.current = field;
    prevTransactionRef.current = transaction;
    prevTransactionRequestRef.current = transactionRequest;
    prevShouldFocusCancelButtonRef.current = shouldFocusCancelButton;
  });

  // componentWillUnmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      // Errors returned directly from the API request (as opposed through a transaction lookup) are
      // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
      // for the next time the modal is opened by removing any existing transaction request from the store.
      if (transactionRequest?.error) {
        clearTransactionRequestAction(fieldName);
      } else if (
        // Dismiss the MHV email confirmation alert if email transaction succeeded
        fieldName === FIELD_NAMES.EMAIL &&
        transactionRequest &&
        !transactionRequest.isPending
      ) {
        dismissEmailConfirmationAlertViaCookie();
      }

      // AS DONE IN ADDRESSEDITVIEW, CHECK FOR CORRECTNESS
      if (fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS) {
        focusElement(`#${getEditButtonId(fieldName)}`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 48147 - Temporary click handler that will be removed once the analytics stats have been gathered around
  // multiple inline validation errors.
  const onClickUpdateHandler = () => {
    handleUpdateButtonClick(
      getErrorsFromDom,
      fieldName,
      recordCustomProfileEvent,
    );
  };

  const copyMailingAddress = mailingAddress => {
    const newAddressValue = { ...field.value, ...mailingAddress };
    onChangeFormDataAndSchemas(
      transformInitialFormValues(newAddressValue),
      field.formSchema,
      field.uiSchema,
    );
  };

  const onSubmit = () => {
    const isAddressField = fieldName.toLowerCase().includes('address');
    if (!isAddressField) {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'update-button',
        'profile-section': analyticsSectionName,
      });
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
        onChangeFormDataAndSchemas(
          field.value,
          field.formSchema,
          field.uiSchema,
        );
        return;
      }

      if (fieldName === PERSONAL_INFO_FIELD_NAMES.MESSAGING_SIGNATURE) {
        updateMessagingSignatureAction(payload, fieldName, 'POST');
        return;
      }

      createPersonalInfoUpdateAction({
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
      createSchedulingPreferencesUpdateAction({
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
      validateAddressAction(
        apiRoute,
        method,
        fieldName,
        payload,
        analyticsSectionName,
      );
      return;
    }

    const createTransactionFn = () => {
      createTransactionAction(
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
      openIntlMobileConfirmModalAction(
        payload.countryCode,
        payload.phoneNumber,
        createTransactionFn,
      );
      return;
    }

    createTransactionFn();
  };

  const onInput = (value, schema, uiSchemaVal) => {
    const addressFieldNames = [
      FIELD_NAMES.MAILING_ADDRESS,
      FIELD_NAMES.RESIDENTIAL_ADDRESS,
    ];

    if (!addressFieldNames.includes(fieldName)) {
      onChangeFormDataAndSchemas(value, schema, uiSchemaVal);
    }

    const newFieldValue = {
      ...value,
    };
    if (newFieldValue['view:livesOnMilitaryBase']) {
      newFieldValue.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;
    }

    onChangeFormDataAndSchemas(newFieldValue, schema, uiSchemaVal);
  };

  const isLoading =
    transactionRequest?.isPending || isPendingTransaction(transaction);

  const isResidentialAddress = fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS;

  const formData =
    context?.formFieldData?.formOnlyUpdate === true
      ? (() => {
          // Merge objects but also handle inputPhoneNumber explicitly
          const merged = {
            ...field?.value,
            ...context.formFieldData,
          };
          // For phone fields, ensure inputPhoneNumber is updated to match the new number
          if (
            [FIELD_NAMES.HOME_PHONE, FIELD_NAMES.MOBILE_PHONE].includes(
              fieldName,
            ) &&
            context.formFieldData?.phoneNumber
          ) {
            merged.inputPhoneNumber =
              context.formFieldData.areaCode +
              context.formFieldData.phoneNumber;
          }
          return merged;
        })()
      : field?.value;

  return (
    <>
      {!!field && (
        <div ref={editFormRef}>
          {isResidentialAddress && (
            <CopyMailingAddress copyMailingAddress={copyMailingAddress} />
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
            onChange={event => onInput(event, field.formSchema, field.uiSchema)}
            onSubmit={onSubmit}
          >
            {fieldName === FIELD_NAMES.MOBILE_PHONE &&
              allowInternationalPhones && (
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
};

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
