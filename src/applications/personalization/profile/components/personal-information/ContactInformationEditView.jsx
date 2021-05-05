import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getContactInfoFieldAttributes from '~/applications/personalization/profile/util/contact-information/getContactInfoFieldAttributes';

import recordEvent from '~/platform/monitoring/record-event';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { focusElement } from '~/platform/utilities/ui';
import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';

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

import { ACTIVE_EDIT_VIEWS, FIELD_NAMES, USA } from '@@vap-svc/constants';

import { transformInitialFormValues } from '@@profile/util/contact-information/formValues';

import ContactInformationActionButtons from './ContactInformationActionButtons';

export class ContactInformationEditView extends Component {
  static propTypes = {
    activeEditView: PropTypes.string,
    analyticsSectionName: PropTypes.oneOf(
      Object.values(VAP_SERVICE.ANALYTICS_FIELD_MAP),
    ).isRequired,
    apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
    clearTransactionRequest: PropTypes.func.isRequired,
    convertCleanDataToPayload: PropTypes.func.isRequired,
    createTransaction: PropTypes.func.isRequired,
    data: PropTypes.object,
    editViewData: PropTypes.object,
    field: PropTypes.shape({
      value: PropTypes.object,
      validations: PropTypes.object,
    }),
    fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES))
      .isRequired,
    formSchema: PropTypes.object.isRequired,
    getInitialFormValues: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    refreshTransaction: PropTypes.func.isRequired,
    title: PropTypes.string,
    transaction: PropTypes.object,
    transactionRequest: PropTypes.object,
    uiSchema: PropTypes.object.isRequired,
    updateFormFieldWithSchema: PropTypes.func.isRequired,
    validateAddress: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { getInitialFormValues } = this.props;
    this.onChangeFormDataAndSchemas(
      getInitialFormValues(),
      this.props.formSchema,
      this.props.uiSchema,
    );
  }

  componentDidUpdate(prevProps) {
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
    // immediately exit edit view
    if (isSuccessfulTransaction(this.props.transaction)) {
      this.props.openModal(null);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    // Errors returned directly from the API request (as opposed through a transaction lookup) are
    // displayed in this modal, rather than on the page. Once the modal is closed, reset the state
    // for the next time the modal is opened by removing any existing transaction request from the store.
    if (this.props.transactionRequest?.error) {
      this.props.clearTransactionRequest(this.props.fieldName);
    }

    // AS DONE IN ADDRESSEDITVIEW, CHECK FOR CORRECTNESS
    if (this.props.fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS) {
      focusElement(`#${this.props.fieldName}-edit-link`);
    }
  }

  captureEvent(actionName) {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': this.props.analyticsSectionName,
    });
  }

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

    const method = payload.id ? 'PUT' : 'POST';

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

  onDelete = () => {
    let payload = this.props.data;
    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(
        payload,
        this.props.fieldName,
      );
    }
    this.props.createTransaction(
      this.props.apiRoute,
      'DELETE',
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
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

  render() {
    const {
      onSubmit,
      props: {
        analyticsSectionName,
        data,
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

    return (
      <>
        {error && (
          <div
            className="vads-u-margin-bottom--2"
            data-testid="edit-error-alert"
          >
            <VAPServiceEditModalErrorMessage
              title={title}
              error={error}
              clearErrors={() => this.props.clearTransactionRequest(fieldName)}
            />
          </div>
        )}

        {!!field && (
          <div>
            {fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS && (
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
              <ContactInformationActionButtons
                onCancel={onCancel}
                onDelete={this.onDelete}
                title={title}
                analyticsSectionName={analyticsSectionName}
                isLoading={isLoading}
                deleteEnabled={
                  data && fieldName !== FIELD_NAMES.MAILING_ADDRESS
                }
              >
                <div>
                  <LoadingButton
                    data-action="save-edit"
                    data-testid="save-edit-button"
                    isLoading={isLoading}
                    loadingText="Saving changes"
                    className="vads-u-width--auto vads-u-margin-top--0"
                  >
                    Update
                  </LoadingButton>

                  {!isLoading && (
                    <button
                      type="button"
                      className="usa-button-secondary vads-u-margin-top--0 vads-u-width--auto"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </ContactInformationActionButtons>
            </SchemaForm>
          </div>
        )}
      </>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    fieldName,
  );
  const data = selectVAPContactInfoField(state, fieldName);
  // const addressValidationType = selectAddressValidationType(state);
  const activeEditView = selectCurrentlyOpenEditModal(state);

  const {
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    title,
  } = getContactInfoFieldAttributes(fieldName);

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
    apiRoute,
    convertCleanDataToPayload,
    data,
    fieldName,
    analyticsSectionName: VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName],
    field: selectEditedFormField(state, fieldName),
    title,
    transaction,
    transactionRequest,
    editViewData: selectEditViewData(state),
    uiSchema,
    formSchema,
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  createTransaction,
  openModal,
  updateFormFieldWithSchema,
  validateAddress,
  refreshTransaction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInformationEditView);
