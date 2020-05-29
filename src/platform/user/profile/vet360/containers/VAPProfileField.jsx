import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import recordEvent from 'platform/monitoring/record-event';
import prefixUtilityClasses from 'platform/utilities/prefix-utility-classes';

import * as VET360 from '../constants';

import { isPendingTransaction } from '../util/transactions';

import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  updateFormFieldWithSchema,
  openModal,
  validateAddress,
} from '../actions';

import {
  selectAddressValidationType,
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
  selectVet360Field,
  selectVet360Transaction,
} from '../selectors';

import VAPEditButton from '../components/base/VAPEditButton';
import Vet360Transaction from '../components/base/Vet360Transaction';

const wrapperClasses = prefixUtilityClasses([
  'display--flex',
  'flex-direction--column',
  'align-items--flex-start',
]);

const wrapperClassesMedium = prefixUtilityClasses(
  ['flex-direction--row', 'justify-content--space-between'],
  'medium',
);

const editButtonClasses = [
  'va-button-link',
  ...prefixUtilityClasses(['margin-top--1p5']),
];

const editButtonClassesMedium = prefixUtilityClasses(
  ['flex--auto', 'margin-top--0'],
  'medium',
);

const classes = {
  wrapper: [...wrapperClasses, ...wrapperClassesMedium].join(' '),
  editButton: [...editButtonClasses, ...editButtonClassesMedium].join(' '),
};

class VAPProfileField extends React.Component {
  static propTypes = {
    ContentView: PropTypes.func.isRequired,
    data: PropTypes.object,
    EditView: PropTypes.func.isRequired,
    field: PropTypes.object,
    fieldName: PropTypes.string.isRequired,
    showEditView: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    transaction: PropTypes.object,
    transactionRequest: PropTypes.object,
  };

  static defaultProps = {
    fieldName: '',
  };

  componentDidUpdate(prevProps) {
    // Just close the edit modal if it takes more than 5 seconds for the update
    // transaction to resolve. ie, give it 5 seconds before reverting to the old
    // behavior of showing the "we're saving your new information..." message on
    // the Profile page
    if (!prevProps.transaction && this.props.transaction) {
      setTimeout(() => this.props.openModal(), 5000);
    }

    if (this.justClosedModal(prevProps, this.props)) {
      if (this.props.transaction) {
        focusElement(`div#${this.props.fieldName}-transaction-status`);
      }
      focusElement(`button#${this.props.fieldName}-edit-link`);
    }
  }

  onAdd = () => {
    this.captureEvent('add-link');
    this.openEditModal();
  };

  onCancel = () => {
    this.captureEvent('cancel-button');
    this.closeModal();
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

  onEdit = () => {
    this.captureEvent('edit-link');
    this.openEditModal();
  };

  onSubmit = () => {
    if (!this.props.fieldName.toLowerCase().includes('address')) {
      this.captureEvent('update-button');
    }

    let payload = this.props.field.value;
    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(
        payload,
        this.props.fieldName,
      );
    }

    const method = payload.id ? 'PUT' : 'POST';

    if (this.props.fieldName.toLowerCase().includes('address')) {
      this.props.validateAddress(
        this.props.apiRoute,
        method,
        this.props.fieldName,
        payload,
        this.props.analyticsSectionName,
      );
      return;
    }

    this.props.createTransaction(
      this.props.apiRoute,
      method,
      this.props.fieldName,
      payload,
      this.props.analyticsSectionName,
    );
  };

  justClosedModal(prevProps, props) {
    return (
      (prevProps.showEditView && !props.showEditView) ||
      (prevProps.showValidationView && !props.showValidationView)
    );
  }

  clearErrors = () => {
    this.props.clearTransactionRequest(this.props.fieldName);
  };

  closeModal = () => {
    this.props.openModal(null);
  };

  openEditModal = () => {
    this.props.openModal(this.props.fieldName);
  };

  refreshTransaction = () => {
    this.props.refreshTransaction(
      this.props.transaction,
      this.props.analyticsSectionName,
    );
  };

  captureEvent(actionName) {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': this.props.analyticsSectionName,
    });
  }

  isEditLinkVisible = () => !isPendingTransaction(this.props.transaction);

  render() {
    const {
      analyticsSectionName,
      ContentView,
      EditView,
      fieldName,
      isEmpty,
      showEditView,
      showValidationView,
      title,
      transaction,
      transactionRequest,
      ValidationView,
    } = this.props;

    const childProps = {
      ...this.props,
      clearErrors: this.clearErrors,
      onAdd: this.onAdd,
      onCancel: this.onCancel,
      onChangeFormDataAndSchemas: this.onChangeFormDataAndSchemas,
      onDelete: this.onDelete,
      onEdit: this.onEdit,
      onSubmit: this.onSubmit,
      refreshTransaction: this.refreshTransaction,
    };

    // default the content to the read-view
    let content = (
      <div className={classes.wrapper}>
        <ContentView data={this.props.data} />
        {this.isEditLinkVisible() && (
          <VAPEditButton
            onEditClick={this.onEdit}
            fieldName={fieldName}
            title={title}
            className={classes.editButton}
          />
        )}
      </div>
    );

    if (isEmpty) {
      content = (
        <button
          type="button"
          onClick={this.onAdd}
          className="va-button-link va-profile-btn"
        >
          Please add your {title.toLowerCase()}
        </button>
      );
    }

    if (showEditView) {
      content = <EditView {...childProps} />;
    }

    if (showValidationView) {
      content = (
        <ValidationView
          transaction={transaction}
          transactionRequest={transactionRequest}
          title={title}
          clearErrors={this.clearErrors}
        />
      );
    }

    return (
      <div className="vet360-profile-field" data-field-name={fieldName}>
        <Vet360Transaction
          isModalOpen={showEditView || showValidationView}
          id={`${fieldName}-transaction-status`}
          title={title}
          transaction={transaction}
          transactionRequest={transactionRequest}
          refreshTransaction={this.refreshTransaction}
        >
          {content}
        </Vet360Transaction>
      </div>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVet360Transaction(
    state,
    fieldName,
  );
  const data = selectVet360Field(state, fieldName);
  const isEmpty = !data;
  const addressValidationType = selectAddressValidationType(state);
  const showValidationView =
    ownProps.ValidationView &&
    addressValidationType === fieldName &&
    // TODO: use a constant for 'addressValidation'
    selectCurrentlyOpenEditModal(state) === 'addressValidation';

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[fieldName],
    data,
    fieldName,
    field: selectEditedFormField(state, fieldName),
    showEditView: selectCurrentlyOpenEditModal(state) === fieldName,
    showValidationView: !!showValidationView,
    isEmpty,
    transaction,
    transactionRequest,
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createTransaction,
  updateFormFieldWithSchema,
  validateAddress,
};

/**
 * Container used to easily create components for VA Profile-backed contact information.
 * @property {string} fieldName The name of the property as it appears in the user.profile.vet360 object.
 * @property {func} ContentView The component used to render the read-display of the field.
 * @property {func} EditView The component used to render the edit mode of the field.
 * @property {func} ValidationView The component used to render validation mode the field.
 * @property {string} title The field name converted to a visible display, such as for labels, modal titles, etc. Example: "mailingAddress" passes "Mailing address" as the title.
 * @property {string} apiRoute The API route used to create/update/delete the VA Profile contact info field.
 * @property {func} convertNextValueToCleanData A function called to derive or make changes to form values after form values are changed in the edit view. Called prior to validation.
 * @property {func} [convertCleanDataToPayload] An optional function used to convert the clean edited data to a payload for sending to the API. Used to remove any values (especially falsy) that may cause errors in the VA Profile service.
 */
const Vet360ProfileFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAPProfileField);

Vet360ProfileFieldContainer.propTypes = {
  fieldName: PropTypes.oneOf(Object.values(VET360.FIELD_NAMES)).isRequired,
  ContentView: PropTypes.func.isRequired,
  EditView: PropTypes.func.isRequired,
  ValidationView: PropTypes.func,
  title: PropTypes.string.isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VET360.API_ROUTES)).isRequired,
  convertCleanDataToPayload: PropTypes.func,
};

export default Vet360ProfileFieldContainer;
export { VAPProfileField };
