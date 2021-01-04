import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import { focusElement } from '~/platform/utilities/ui';
import recordEvent from '~/platform/monitoring/record-event';
import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';

import * as VAP_SERVICE from '@@vap-svc/constants';

import {
  isFailedTransaction,
  isPendingTransaction,
} from '@@vap-svc/util/transactions';

import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  updateFormFieldWithSchema,
  openModal,
  validateAddress,
} from '@@vap-svc/actions';

import {
  selectAddressValidationType,
  selectCurrentlyOpenEditModal,
  selectEditedFormField,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
} from '@@vap-svc/selectors';

import { isVAPatient } from '~/platform/user/selectors';

import { FIELD_NAMES } from '@@vap-svc/constants';
import VAPServiceTransaction from '@@vap-svc/components/base/VAPServiceTransaction';
import AddressValidationView from '@@vap-svc/containers/AddressValidationView';

import ContactInformationEditView from '@@profile/components/personal-information/ContactInformationEditView';
import ContactInformationView from '@@profile/components/personal-information/ContactInformationView';

import { getInitialFormValues } from 'applications/personalization/profile/util/getInitialFormValues';
import ContactInformationEditButton from './ContactInformationEditButton';

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

class ContactInformationField extends React.Component {
  static propTypes = {
    data: PropTypes.object,
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
      this.closeModalTimeoutID = setTimeout(
        () => this.closeModal(),
        // Using 50ms as the unit test timeout before exiting edit view while
        // waiting for an update to happen. Being too aggressive, like 5ms,
        // results in exiting the edit view before Redux has had time to do
        // everything it needs to do. In that situation we see the "we're saving
        // your..." message while Redux is processing everything.
        window.VetsGov.pollTimeout ? 50 : 5000,
      );
    }

    // Do not auto-exit edit view if the transaction failed
    if (this.transactionJustFailed(prevProps, this.props)) {
      clearTimeout(this.closeModalTimeoutID);
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

  transactionJustFailed(prevProps, props) {
    const previousTransaction = prevProps.transaction;
    const currentTransaction = props.transaction;
    return (
      !isFailedTransaction(previousTransaction) &&
      isFailedTransaction(currentTransaction)
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

  // THIS IS WHERE WE MESS UP
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
      fieldName,
      isEmpty,
      showEditView,
      showValidationView,
      title,
      transaction,
      transactionRequest,
      type,
      data,
    } = this.props;

    const activeSection = VAP_SERVICE.FIELD_TITLES[
      activeEditView
    ]?.toLowerCase();

    const wrapInTransaction = children => {
      return (
        <VAPServiceTransaction
          isModalOpen={showEditView || showValidationView}
          id={`${fieldName}-transaction-status`}
          title={title}
          transaction={transaction}
          transactionRequest={transactionRequest}
          refreshTransaction={this.refreshTransaction}
        >
          {children}
        </VAPServiceTransaction>
      );
    };

    // default the content to the read-view
    let content = wrapInTransaction(
      <div className={classes.wrapper}>
        <ContactInformationView data={data} type={type} fieldName={fieldName} />

        {this.isEditLinkVisible() && (
          <ContactInformationEditButton
            onEditClick={this.onEdit}
            fieldName={fieldName}
            title={title}
            className={classes.editButton}
          />
        )}
      </div>,
    );

    if (isEmpty) {
      content = wrapInTransaction(
        <button
          type="button"
          onClick={this.onAdd}
          className="va-button-link va-profile-btn"
          id={`${fieldName}-edit-link`}
        >
          Please add your {title.toLowerCase()}
        </button>,
      );
    }

    if (showEditView) {
      content = (
        <ContactInformationEditView
          analyticsSectionName={this.props.analyticsSectionName} // FROM REDUX
          clearErrors={this.clearErrors}
          deleteDisabled={this.props.deleteDisabled} // FROM 2 LEVELS UP, ONLY TRUE FOR MAILING ADDRESS
          field={this.props.field} // FROM REDUX
          fieldName={this.props.fieldName} // FROM REDUX
          formSchema={this.props.formSchema} // FROM 1 LEVEL UP
          getInitialFormValues={() =>
            getInitialFormValues({
              type: this.props.type,
              data: this.props.data,
              showSMSCheckbox: this.props.showSMSCheckbox,
              modalData: this.props.modalData,
            })
          }
          hasUnsavedEdits={this.props.hasUnsavedEdits} // FROM REDUX
          hasValidationError={this.props.hasValidationError} // DOES NOT EXIST??
          isEmpty={this.props.isEmpty} // FROM REDUX
          onCancel={this.onCancel}
          onChangeFormDataAndSchemas={this.onChangeFormDataAndSchemas}
          onDelete={this.onDelete}
          onSubmit={this.onSubmit}
          refreshTransaction={this.refreshTransaction} // FROM REDUX
          title={this.props.title} // NOT SURE
          transaction={this.props.transaction} // FROM REDUX
          transactionRequest={this.props.transactionRequest} // FROM REDUX
          uiSchema={this.props.uiSchema} // FROM 1 LEVEL UP
          type={this.props.type} // FROM 1 LEVEL UP
        />
      );
    }

    if (showValidationView) {
      content = (
        <AddressValidationView
          refreshTransaction={this.refreshTransaction}
          transaction={transaction}
          transactionRequest={transactionRequest}
          title={title}
          clearErrors={this.clearErrors}
        />
      );
    }

    return (
      <div
        className="vet360-profile-field"
        data-field-name={fieldName}
        data-testid={fieldName}
      >
        <Modal
          title={'Are you sure?'}
          status="warning"
          visible={this.state.showConfirmCancelModal}
          onClose={() => {
            this.setState({ showConfirmCancelModal: false });
          }}
        >
          <p>
            {`You haven’t finished editing your ${activeSection}. If you cancel, your in-progress work won’t be saved.`}
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

        {content}
      </div>
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
  const isEmpty = !data;
  const addressValidationType = selectAddressValidationType(state);
  const activeEditView = selectCurrentlyOpenEditModal(state);
  // Double check we don't need another conditonal here
  const showValidationView =
    addressValidationType === fieldName &&
    // TODO: use a constant for 'addressValidation'
    activeEditView === 'addressValidation';
  const isEnrolledInVAHealthCare = isVAPatient(state);
  const showSMSCheckbox =
    ownProps.fieldName === FIELD_NAMES.MOBILE_PHONE && isEnrolledInVAHealthCare;
  return {
    hasUnsavedEdits: state.vapService.hasUnsavedEdits,
    analyticsSectionName: VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName],
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
    showEditView: activeEditView === fieldName,
    showValidationView: !!showValidationView,
    isEmpty,
    transaction,
    transactionRequest,
    modalData: state.vapService?.modalData,
    showSMSCheckbox,
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
 * @property {string} fieldName The name of the property as it appears in the user.profile.vapContactInfo object.
 * @property {string} title The field name converted to a visible display, such as for labels, modal titles, etc. Example: "mailingAddress" passes "Mailing address" as the title.
 * @property {string} apiRoute The API route used to create/update/delete the VA Profile contact info field.
 * @property {func} [convertCleanDataToPayload] An optional function used to convert the clean edited data to a payload for sending to the API. Used to remove any values (especially falsy) that may cause errors in the VA Profile service.
 */
const ContactInformationFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInformationField);

ContactInformationFieldContainer.propTypes = {
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  title: PropTypes.string.isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  convertCleanDataToPayload: PropTypes.func,
  hasUnsavedEdits: PropTypes.bool,
};

export default ContactInformationFieldContainer;
export { ContactInformationField };
