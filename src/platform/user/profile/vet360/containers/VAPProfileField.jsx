import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

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
    hasUnsavedEdits: false,
  };

  state = {
    showCannotEditModal: false,
    showConfirmCancelModal: false,
  };

  closeModalTimeoutID = null;

  componentDidUpdate(prevProps) {
    // Exit the edit view if it takes more than 5 seconds for the update/save
    // transaction to resolve. If the transaction has not resolved after 5
    // seconds we will show a "we're saving your new information..." message on
    // the Profile
    if (!prevProps.transaction && this.props.transaction) {
      this.closeModalTimeoutID = setTimeout(() => this.closeModal(), 5000);
    }

    if (this.justClosedModal(prevProps, this.props)) {
      clearTimeout(this.closeModalTimeoutID);
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

    if (!this.props.hasUnsavedEdits) {
      this.closeModal();
      return;
    }

    this.setState({ showConfirmCancelModal: true });
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
    if (this.props.blockEditMode) {
      this.setState({ showCannotEditModal: true });
    } else {
      this.props.openModal(this.props.fieldName);
    }
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
      activeEditView,
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

    const activeSection = VET360.FIELD_TITLES[activeEditView]?.toLowerCase();

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
          id={`${this.props.fieldName}-edit-link`}
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
        <Modal
          title={'Are you sure?'}
          status="warning"
          visible={this.state.showConfirmCancelModal}
          onClose={() => {
            this.setState({ showConfirmCancelModal: false });
          }}
        >
          <p>
            {' '}
            {`You haven’t finished editing your ${activeSection}. If you cancel, your in-progress work won't be saved.`}
          </p>
          <button
            className="usa-button-secondary"
            onClick={() => {
              this.setState({ showConfirmCancelModal: false });
            }}
          >
            Continue Editing
          </button>
          <button
            onClick={() => {
              this.setState({ showConfirmCancelModal: false });
              this.closeModal();
            }}
          >
            Cancel
          </button>
        </Modal>

        <Modal
          title={`You’re currently editing your ${activeSection}`}
          status="warning"
          visible={this.state.showCannotEditModal}
          onClose={() => {
            this.setState({ showCannotEditModal: false });
          }}
        >
          <p>
            Please go back and save or cancel your work before editing a new
            section of your profile. If you cancel, your in-progress work won’t
            be saved.
          </p>
          <button
            onClick={() => {
              this.setState({ showCannotEditModal: false });
            }}
          >
            OK
          </button>
        </Modal>
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
  const activeEditView = selectCurrentlyOpenEditModal(state);
  const showValidationView =
    ownProps.ValidationView &&
    addressValidationType === fieldName &&
    // TODO: use a constant for 'addressValidation'
    activeEditView === 'addressValidation';

  return {
    hasUnsavedEdits: state.vet360.hasUnsavedEdits,
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[fieldName],
    blockEditMode: !!activeEditView,
    /*
    This ternary is to deal with an edge case: if the user is currently viewing
    the address validation view we need to handle things differently or text in
    the modal would be inaccurate. This is an unfortunate hack to get around an
    existing hack we've been using to determine if we need to show the address
    validation view or not.
    */
    activeEditView:
      activeEditView === 'addressValidation'
        ? addressValidationType
        : activeEditView,
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
  hasUnsavedEdits: PropTypes.bool,
};

export default Vet360ProfileFieldContainer;
export { VAPProfileField };
