import React, { Component } from 'react';
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
import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  openModal,
  updateFormFieldWithSchema,
  validateAddress,
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
} from '../util/transactions';
import { getEditButtonId } from '../util/id-factory';

import VAPServiceEditModalErrorMessage from './base/VAPServiceEditModalErrorMessage';
import CopyMailingAddress from '../containers/CopyMailingAddress';

import { createPersonalInfoUpdate } from '../actions/personalInformation';
import { updateMessagingSignature } from '../../actions/mhv';

import ProfileInformationActionButtons from './ProfileInformationActionButtons';

const MailingAddressUpdateLocationDescription = () => (
  <p>
    If you select "yes", this information will be updated across multiple VA.gov
    benefits and services. Read more about{' '}
    <va-link
      href="/change-address/"
      text="changing your address in your VA.gov profile"
      external
    />
  </p>
);

const mailingAddressUpdateLocationUiSchema = radioUI({
  title: 'Do you also want to update this information in your VA.gov profile?',
  description: MailingAddressUpdateLocationDescription,
  labels: {
    yes: 'Yes, also update my profile',
    no: 'No, only update this form',
  },
});

const mailingAddressUpdateLocationSchema = radioSchema(['yes', 'no']);

export class ProfileInformationEditView extends Component {
  componentDidMount() {
    const {
      getInitialFormValues,
      showMailingAddressUpdateLocationChoice,
    } = this.props;

    const initialFormValues = getInitialFormValues();

    const formSchema = {
      ...this.props.formSchema,
      properties: {
        ...this.props.formSchema.properties,
        updateLocationChoice: mailingAddressUpdateLocationSchema,
      },
      required: [...this.props.formSchema.required, 'updateLocationChoice'],
    };
    const uiSchema = {
      ...this.props.uiSchema,
      updateLocationChoice: mailingAddressUpdateLocationUiSchema,
    };

    this.onChangeFormDataAndSchemas(
      initialFormValues,
      showMailingAddressUpdateLocationChoice
        ? formSchema
        : this.props.formSchema,
      showMailingAddressUpdateLocationChoice ? uiSchema : this.props.uiSchema,
    );
    this.focusOnFirstFormElement();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.field && !!this.props.field) {
      this.focusOnFirstFormElement();
    }

    if (
      this.props.transactionRequest?.error ||
      isFailedTransaction(this.props.transaction)
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
    const { fieldName } = this.props;
    // Errors returned directly from the API request (as opposed through a transaction lookup) are
    // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
    // for the next time the modal is opened by removing any existing transaction request from the store.
    if (this.props.transactionRequest?.error) {
      this.props.clearTransactionRequest(fieldName);
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

    this.props.createTransaction(
      apiRoute,
      method,
      fieldName,
      payload,
      analyticsSectionName,
    );
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
        const focusableElement = getFocusableElements(this.editForm)?.[0];

        if (focusableElement) {
          focusElement(focusableElement);
        }
      }, 100);
    }
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
      },
      onClickUpdateHandler,
    } = this;

    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);
    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    const isResidentialAddress = fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS;

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
              data={field.value}
              uiSchema={field.uiSchema}
              onChange={event =>
                this.onInput(event, field.formSchema, field.uiSchema)
              }
              onSubmit={onSubmit}
            >
              {error && (
                <div
                  role="alert"
                  className="vads-u-margin-y--2"
                  data-testid="edit-error-alert"
                >
                  <VAPServiceEditModalErrorMessage error={error} />
                </div>
              )}
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
  }
}

ProfileInformationEditView.propTypes = {
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
  showUpdateRadios: PropTypes.bool.isRequired,
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
  showMailingAddressUpdateLocationChoice: PropTypes.bool,
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
  updateMessagingSignature,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileInformationEditView);
