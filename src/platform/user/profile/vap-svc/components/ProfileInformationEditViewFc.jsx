import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import recordEvent from 'platform/monitoring/record-event';
import { isEmptyAddress } from 'platform/forms/address/helpers';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { getFocusableElements } from 'platform/forms-system/src/js/utilities/ui';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  openModal,
  updateFormFieldWithSchema,
  validateAddress,
} from '../actions';
import { updateMessagingSignature } from '../../actions/mhv';

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
} from '../util/transactions';
import { getEditButtonId } from '../util/id-factory';

import CopyMailingAddress from '../containers/CopyMailingAddress';

import { createPersonalInfoUpdate } from '../actions/personalInformation';

import ProfileInformationActionButtons from './ProfileInformationActionButtons';
import { useContactInfoFormAppConfig } from './ContactInfoFormAppConfigContext';

const MailingAddressUpdateProfileDescription = () => (
  <p
    className="vads-u-color--gray-medium vads-u-margin-top--0"
    style={{ paddingInline: '2px' }}
  >
    If you select "yes", this information will be updated across multiple VA.gov
    benefits and services. Read more about{' '}
    <va-link
      href="/change-address/"
      text="changing your address in your VA.gov profile"
      external
    />
  </p>
);

const mailingAddressUpdateProfileUiSchema = radioUI({
  title: 'Do you also want to update this information in your VA.gov profile?',
  description: MailingAddressUpdateProfileDescription,
  labels: {
    yes: 'Yes, also update my profile',
    no: 'No, only update this form',
  },
});

const mailingAddressUpdateProfileSchema = radioSchema(['yes', 'no']);

const updateSchemasForMailingAddressUpdateProfileChoice = (
  showMailingAddressUpdateProfileChoice,
  formSchema,
  uiSchema,
) => {
  if (showMailingAddressUpdateProfileChoice) {
    return {
      formSchema: {
        ...formSchema,
        properties: {
          ...formSchema.properties,
          updateProfileChoice: mailingAddressUpdateProfileSchema,
        },
        required: [...formSchema.required, 'updateProfileChoice'],
      },
      uiSchema: {
        ...uiSchema,
        updateProfileChoice: mailingAddressUpdateProfileUiSchema,
      },
    };
  }

  return {
    formSchema,
    uiSchema,
  };
};

export const ProfileInformationEditViewFc = ({
  getInitialFormValues,
  showMailingAddressUpdateProfileChoice,
  fieldName,
  transactionRequest,
  transaction,
  field,
  onCancel,
  formSchema,
  uiSchema,
  forceEditView,
  analyticsSectionName,
  title,
  cancelButtonText,
  saveButtonText,
  apiRoute,
  convertCleanDataToPayload,
  successCallback,
  refreshTransaction: refreshTransactionAction,
  clearTransactionRequest: clearTransactionRequestAction,
  updateFormFieldWithSchema: updateFormFieldWithSchemaAction,
  validateAddress: validateAddressAction,
  createTransaction: createTransactionAction,
  createPersonalInfoUpdate: createPersonalInfoUpdateAction,
  updateMessagingSignature: updateMessagingSignatureAction,
}) => {
  const editFormRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);

  const contactInfoFormAppConfig = useContactInfoFormAppConfig();

  const isPendingTransactionMemo = useMemo(
    () => {
      return isPendingTransaction(transaction);
    },
    [transaction],
  );

  const focusOnFirstFormElement = useCallback(
    () => {
      if (forceEditView) {
        // Showing the edit view on its own page, so let the app handle focus
        return;
      }

      if (editFormRef.current) {
        setTimeout(() => {
          const focusableElement = getFocusableElements(
            editFormRef.current,
          )?.[0];

          if (focusableElement) {
            focusElement(focusableElement);
          }
        }, 100);
      }
    },
    [forceEditView],
  );

  const handleRefreshTransaction = useCallback(
    () => {
      refreshTransactionAction(transaction, analyticsSectionName);
    },
    [transaction, analyticsSectionName, refreshTransactionAction],
  );

  // Component mount effects
  useEffect(() => {
    // this determines if we should use the form field data from the form app
    // instead of the initial form values from the profile because the user has
    // already selected "no" to updating their profile from the form app
    // this also ONLY applies to the mailing address field
    const shouldUseFormAppFieldData =
      contactInfoFormAppConfig.fieldName === FIELD_NAMES.MAILING_ADDRESS &&
      contactInfoFormAppConfig?.formFieldData &&
      (contactInfoFormAppConfig?.formFieldData?.updateProfileChoice === 'no' ||
        contactInfoFormAppConfig?.formFieldData?.formOnlyUpdate === true);

    const initialFormValues = shouldUseFormAppFieldData
      ? contactInfoFormAppConfig?.formFieldData
      : getInitialFormValues();

    const {
      uiSchema: updatedUiSchema,
      formSchema: updatedFormSchema,
    } = updateSchemasForMailingAddressUpdateProfileChoice(
      showMailingAddressUpdateProfileChoice,
      formSchema,
      uiSchema,
    );

    updateFormFieldWithSchemaAction(
      fieldName,
      initialFormValues,
      updatedFormSchema,
      updatedUiSchema,
    );

    focusOnFirstFormElement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ComponentDidUpdate for field changes
  useEffect(
    () => {
      if (field) {
        focusOnFirstFormElement();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [field, focusOnFirstFormElement],
  );

  // ComponentDidUpdate for error handling
  useEffect(
    () => {
      if (transactionRequest?.error || isFailedTransaction(transaction)) {
        focusElement('button[aria-label="Close notification"]');
      }
    },
    [transactionRequest, transaction],
  );

  // ComponentDidUpdate for transaction polling
  useEffect(
    () => {
      // If transaction just became pending, start calling refreshTransaction on an interval
      if (isPendingTransactionMemo && !intervalId) {
        const newIntervalId = window.setInterval(
          () => handleRefreshTransaction(),
          window.VetsGov.pollTimeout || 2000,
        );
        setIntervalId(newIntervalId);
      }

      // If we had an interval but transaction is no longer pending, clean it up
      if (intervalId && !isPendingTransactionMemo) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }

      // Cleanup on unmount
      return () => {
        if (intervalId) {
          window.clearInterval(intervalId);
          setIntervalId(null);
        }
      };
    },
    [isPendingTransactionMemo, intervalId, handleRefreshTransaction],
  );

  // ComponentWillUnmount
  useEffect(() => {
    return () => {
      // Errors returned directly from the API request are displayed in this modal,
      // rather than on the page. Reset the state for the next time the modal is opened.
      if (transactionRequest?.error) {
        clearTransactionRequestAction(fieldName);
      }

      if (fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS) {
        focusElement(`#${getEditButtonId(fieldName)}`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Event handlers
  const onClickUpdateHandler = () => {
    handleUpdateButtonClick(
      getErrorsFromDom,
      fieldName,
      recordCustomProfileEvent,
    );
  };

  const copyMailingAddress = mailingAddress => {
    const newAddressValue = { ...field.value, ...mailingAddress };
    updateFormFieldWithSchemaAction(
      fieldName,
      transformInitialFormValues(newAddressValue),
      field.formSchema,
      field.uiSchema,
    );
  };

  const captureEvent = actionName => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': analyticsSectionName,
    });
  };

  const onInput = (value, schema, uiSchemaUpdate) => {
    const addressFieldNames = [
      FIELD_NAMES.MAILING_ADDRESS,
      FIELD_NAMES.RESIDENTIAL_ADDRESS,
    ];

    if (!addressFieldNames.includes(fieldName)) {
      updateFormFieldWithSchemaAction(fieldName, value, schema, uiSchemaUpdate);
      return;
    }

    // Create a new field value based on the input value
    const newFieldValue = {
      ...value,
    };

    if (newFieldValue['view:livesOnMilitaryBase']) {
      newFieldValue.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;
    }

    updateFormFieldWithSchemaAction(
      fieldName,
      newFieldValue,
      schema,
      uiSchemaUpdate,
    );
  };

  const onSubmit = async () => {
    const isAddressField = fieldName.toLowerCase().includes('address');

    if (!isAddressField) {
      captureEvent('update-button');
    }

    let payload = field.value;

    // For addresses, check if this is a form-only update via updateProfileChoice='no'
    // For phone/email, we always use formOnlyUpdate=true
    const isFormOnly = isAddressField
      ? payload?.updateProfileChoice === 'no'
      : true; // Phone/email are always form-only updates

    const onlyValidate =
      payload?.updateProfileChoice && payload?.updateProfileChoice === 'no';

    if (convertCleanDataToPayload) {
      payload = convertCleanDataToPayload(payload, fieldName);
    }

    if (Object.values(PERSONAL_INFO_FIELD_NAMES).includes(fieldName)) {
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

    const method = payload?.id ? 'PUT' : 'POST';

    if (isAddressField) {
      // For addresses, we validate and potentially update the form data
      // await validateAddressAction(
      const validationResult = await validateAddressAction(
        apiRoute,
        method,
        fieldName,
        payload,
        analyticsSectionName,
        isFormOnly,
        onlyValidate,
      );

      // this is to handle the case where the user has selected "no" to updating
      // their profile information from a form app context
      if (validationResult?.onlyValidate) {
        contactInfoFormAppConfig.updateContactInfoForFormApp(
          fieldName,
          payload,
          field.value?.updateProfileChoice,
        );
        successCallback();
        clearTransactionRequestAction(fieldName);
        openModal();
      }

      return;
    }

    createTransactionAction(
      apiRoute,
      method,
      fieldName,
      payload,
      analyticsSectionName,
    );
  };

  // Render
  const isLoading =
    transactionRequest?.isPending || isPendingTransaction(transaction);

  const isResidentialAddress = fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS;

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
            data={
              contactInfoFormAppConfig.fieldName ===
                FIELD_NAMES.MAILING_ADDRESS &&
              contactInfoFormAppConfig?.formFieldData &&
              contactInfoFormAppConfig?.formFieldData?.updateProfileChoice ===
                'no'
                ? contactInfoFormAppConfig.formFieldData
                : field.value
            }
            uiSchema={field.uiSchema}
            onChange={event => onInput(event, field.formSchema, field.uiSchema)}
            onSubmit={onSubmit}
          >
            <ProfileInformationActionButtons
              onCancel={onCancel}
              title={title}
              analyticsSectionName={analyticsSectionName}
              isLoading={isLoading}
            >
              <div className="vads-u-display--block mobile-lg:vads-u-display--flex">
                <LoadingButton
                  data-action="save-edit"
                  data-testid="save-edit-button"
                  isLoading={isLoading}
                  loadingText="Saving changes"
                  type="submit"
                  onClick={onClickUpdateHandler}
                >
                  {saveButtonText || 'Save'}
                </LoadingButton>

                {!isLoading && (
                  <button
                    data-testid="cancel-edit-button"
                    type="button"
                    className="usa-button-secondary vads-u-margin-top--1p4 mobile-lg:vads-u-margin-top--1p5 vads-u-width--full mobile-lg:vads-u-width--auto"
                    onClick={onCancel}
                  >
                    {cancelButtonText || 'Cancel'}
                  </button>
                )}
              </div>
            </ProfileInformationActionButtons>
          </SchemaForm>
        </div>
      )}
    </>
  );
};

ProfileInformationEditViewFc.propTypes = {
  analyticsSectionName: PropTypes.oneOf(Object.values(ANALYTICS_FIELD_MAP))
    .isRequired,
  apiRoute: PropTypes.oneOf(Object.values(API_ROUTES)).isRequired,
  clearTransactionRequest: PropTypes.func.isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  createPersonalInfoUpdate: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  fieldName: PropTypes.oneOf(Object.values(FIELD_NAMES)).isRequired,
  formSchema: PropTypes.object.isRequired,
  getInitialFormValues: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  recordCustomProfileEvent: PropTypes.func.isRequired,
  refreshTransaction: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  updateFormFieldWithSchema: PropTypes.func.isRequired,
  validateAddress: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  activeEditView: PropTypes.string,
  cancelButtonText: PropTypes.string,
  data: PropTypes.object,
  editViewData: PropTypes.object,
  field: PropTypes.shape({
    value: PropTypes.object,
    validations: PropTypes.object,
    formSchema: PropTypes.object,
    uiSchema: PropTypes.object,
  }),
  forceEditView: PropTypes.bool,
  saveButtonText: PropTypes.string,
  showMailingAddressUpdateProfileChoice: PropTypes.bool,
  successCallback: PropTypes.func,
  title: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
  updateMessagingSignature: PropTypes.func,
};

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    fieldName,
  );
  const data = selectVAPContactInfoField(state, fieldName);
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
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createTransaction,
  updateFormFieldWithSchema,
  validateAddress,
  createPersonalInfoUpdate,
  updateMessagingSignature,
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileInformationEditViewFc);
