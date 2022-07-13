import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { isEmptyAddress } from 'platform/forms/address/helpers';

import { createPersonalInfoUpdate } from '@@profile/actions/personalInformation';

import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  openModal,
  updateFormFieldWithSchema,
  validateAddress,
} from '@@vap-svc/actions';

import * as VAP_SERVICE from '@@vap-svc/constants';
import {
  ACTIVE_EDIT_VIEWS,
  FIELD_NAMES,
  USA,
  PERSONAL_INFO_FIELD_NAMES,
} from '@@vap-svc/constants';

import {
  isFailedTransaction,
  isPendingTransaction,
  isSuccessfulTransaction,
} from '@@vap-svc/util/transactions';
import VAPServiceEditModalErrorMessage from '@@vap-svc/components/base/VAPServiceEditModalErrorMessage';
import CopyMailingAddress from '@@vap-svc/containers/CopyMailingAddress';

import {
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectEditViewData,
} from '@@vap-svc/selectors';

import { transformInitialFormValues } from '@@profile/util/contact-information/formValues';
import { getEditButtonId } from '@@vap-svc/util/id-factory';

import { focusElement } from '~/platform/utilities/ui';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import recordEvent from '~/platform/monitoring/record-event';

import ProfileInformationActionButtons from './ProfileInformationActionButtons';

const propTypes = {
  analyticsSectionName: PropTypes.oneOf(
    Object.values(VAP_SERVICE.ANALYTICS_FIELD_MAP),
  ).isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  clearTransactionRequest: PropTypes.func.isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  createPersonalInfoUpdate: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  formSchema: PropTypes.object.isRequired,
  getInitialFormValues: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  refreshTransaction: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  updateFormFieldWithSchema: PropTypes.func.isRequired,
  validateAddress: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  activeEditView: PropTypes.string,
  data: PropTypes.object,
  editViewData: PropTypes.object,
  field: PropTypes.shape({
    value: PropTypes.object,
    validations: PropTypes.object,
    formSchema: PropTypes.object,
    uiSchema: PropTypes.object,
  }),
  title: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
};

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
    // if a transaction was created that was immediately successful (for example
    // when the transaction's status is `COMPLETED_NO_CHANGES_DETECTED`),
    // immediately exit edit view and clear the transaction request so it can be triggered again
    if (isSuccessfulTransaction(this.props.transaction)) {
      this.props.openModal(null);
      this.props.clearTransactionRequest(this.props.fieldName);
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
    const focusableElement = this.editForm?.querySelector(
      'button, input, select, a, textarea',
    );
    if (focusableElement) {
      focusableElement.focus();
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
      },
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
                <div>
                  <LoadingButton
                    data-action="save-edit"
                    data-testid="save-edit-button"
                    isLoading={isLoading}
                    loadingText="Saving changes"
                    className="vads-u-margin-top--0"
                  >
                    Update
                  </LoadingButton>

                  {!isLoading && (
                    <button
                      data-testid="cancel-edit-button"
                      type="button"
                      className="usa-button-secondary small-screen:vads-u-margin-top--0"
                      onClick={onCancel}
                    >
                      Cancel
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

ProfileInformationEditView.propTypes = propTypes;

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
    analyticsSectionName: VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName],
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileInformationEditView);
