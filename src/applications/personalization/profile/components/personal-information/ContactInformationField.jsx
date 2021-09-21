import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { kebabCase } from 'lodash';

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
  openModal,
} from '@@vap-svc/actions';

import {
  selectAddressValidationType,
  selectCurrentlyOpenEditModal,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectEditViewData,
} from '@@vap-svc/selectors';

import { isVAPatient } from '~/platform/user/selectors';

import { ACTIVE_EDIT_VIEWS, FIELD_NAMES } from '@@vap-svc/constants';
import VAPServiceTransaction from '@@vap-svc/components/base/VAPServiceTransaction';
import AddressValidationView from '@@vap-svc/containers/AddressValidationView';

import ContactInformationEditView from '@@profile/components/personal-information/ContactInformationEditView';
import ContactInformationView from '@@profile/components/personal-information/ContactInformationView';

import { showNotificationSettings } from '@@profile/selectors';

import { getInitialFormValues } from '@@profile/util/contact-information/formValues';

import getContactInfoFieldAttributes from '~/applications/personalization/profile/util/contact-information/getContactInfoFieldAttributes';

import CannotEditModal from './CannotEditModal';
import ConfirmCancelModal from './ConfirmCancelModal';
import ConfirmRemoveModal from './ConfirmRemoveModal';

// Helper function that generates a string that can be used for a contact info
// field's edit button.
//
// Given a valid entry from the vap-svc/constants FIELD
// NAMES, it will return a string like `#edit-mobile-phone-number`
export const getEditButtonId = fieldName => {
  return `edit-${kebabCase(VAP_SERVICE.FIELD_TITLES[fieldName])}`;
};

const wrapperClasses = prefixUtilityClasses([
  'display--flex',
  'flex-direction--column',
  'align-items--flex-start',
]);

const editButtonClasses = [...prefixUtilityClasses(['margin-top--1p5'])];

const classes = {
  wrapper: wrapperClasses.join(' '),
  editButton: editButtonClasses.join(' '),
};

class ContactInformationField extends React.Component {
  static propTypes = {
    activeEditView: PropTypes.string,
    analyticsSectionName: PropTypes.oneOf(
      Object.values(VAP_SERVICE.ANALYTICS_FIELD_MAP),
    ).isRequired,
    apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
    blockEditMode: PropTypes.bool.isRequired,
    clearTransactionRequest: PropTypes.func.isRequired,
    convertCleanDataToPayload: PropTypes.func.isRequired,
    createTransaction: PropTypes.func.isRequired,
    data: PropTypes.object,
    editViewData: PropTypes.object,
    fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES))
      .isRequired,
    formSchema: PropTypes.object.isRequired,
    hasUnsavedEdits: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    isEnrolledInVAHealthCare: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    refreshTransactionRequest: PropTypes.func,
    showEditView: PropTypes.bool.isRequired,
    showSMSCheckBox: PropTypes.bool,
    showValidationView: PropTypes.bool.isRequired,
    title: PropTypes.string,
    transaction: PropTypes.object,
    transactionRequest: PropTypes.object,
    uiSchema: PropTypes.object.isRequired,
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
    const { fieldName } = this.props;
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
        focusElement(`div#${fieldName}-transaction-status`);
      }
      focusElement(`#${getEditButtonId(fieldName)}`);
    }
  }

  onCancel = () => {
    this.captureEvent('cancel-button');

    if (!this.props.hasUnsavedEdits) {
      this.closeModal();
      return;
    }

    this.setState({ showConfirmCancelModal: true });
  };

  cancelDeleteAction = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'cancel-delete-button',
      'profile-section': this.props.analyticsSectionName,
    });
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

  confirmDeleteAction = e => {
    e.preventDefault();
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'confirm-delete-button',
      'profile-section': this.props.analyticsSectionName,
    });
    this.onDelete();
  };

  clearErrors = () => {
    this.props.clearTransactionRequest(this.props.fieldName);
  };

  onEdit = (event = 'edit-link') => {
    this.captureEvent(event);
    this.openEditModal();
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

  openRemoveModal = () => {
    this.props.openModal(`remove-${this.props.fieldName}`);
  };

  refreshTransactionNotProps = () => {
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

  handleDeleteInitiated = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'delete-button',
      'profile-section': this.props.analyticsSectionName,
    });
    this.openRemoveModal();
  };

  render() {
    const {
      activeEditView,
      fieldName,
      isEmpty,
      showEditView,
      showRemoveModal,
      showValidationView,
      title,
      transaction,
      transactionRequest,
      data,
      isEnrolledInVAHealthCare,
    } = this.props;

    const activeSection = VAP_SERVICE.FIELD_TITLES[
      activeEditView
    ]?.toLowerCase();

    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);

    const wrapInTransaction = children => {
      return (
        <VAPServiceTransaction
          isModalOpen={showEditView || showValidationView || showRemoveModal}
          id={`${fieldName}-transaction-status`}
          title={title}
          transaction={transaction}
          transactionRequest={transactionRequest}
          refreshTransaction={this.refreshTransactionNotProps}
        >
          {children}
        </VAPServiceTransaction>
      );
    };

    // default the content to the read-view
    let content = wrapInTransaction(
      <div className={classes.wrapper}>
        <ContactInformationView
          data={data}
          fieldName={fieldName}
          title={title}
        />

        <div className="vads-u-width--full">
          <div>
            {this.isEditLinkVisible() && (
              <button
                aria-label={`Edit ${title}`}
                type="button"
                data-action="edit"
                onClick={() => {
                  this.onEdit(isEmpty ? 'add-link' : 'edit-link');
                }}
                id={getEditButtonId(fieldName)}
                className={classes.editButton}
              >
                Edit
              </button>
            )}
            {data &&
              fieldName !== FIELD_NAMES.MAILING_ADDRESS && (
                <button
                  aria-label={`Remove ${title}`}
                  type="button"
                  className="small-screen:vads-u-margin--0 usa-button-secondary"
                  onClick={this.handleDeleteInitiated}
                >
                  Remove
                </button>
              )}
          </div>
        </div>
      </div>,
    );

    if (showEditView) {
      content = (
        <ContactInformationEditView
          getInitialFormValues={() =>
            getInitialFormValues({
              fieldName,
              data: this.props.data,
              showSMSCheckbox: this.props.showSMSCheckbox,
              modalData: this.props.editViewData,
            })
          }
          onCancel={this.onCancel}
          fieldName={this.props.fieldName}
          apiRoute={this.props.apiRoute}
          convertCleanDataToPayload={this.props.convertCleanDataToPayload}
          uiSchema={this.props.uiSchema}
          formSchema={this.props.formSchema}
          title={title}
        />
      );
    }

    if (showValidationView) {
      content = (
        <AddressValidationView
          refreshTransaction={this.refreshTransactionNotProps}
          transaction={transaction}
          transactionRequest={transactionRequest}
          title={title}
          clearErrors={this.clearErrors}
        />
      );
    }

    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    return (
      <div
        className="vet360-profile-field"
        data-field-name={fieldName}
        data-testid={fieldName}
      >
        <ConfirmCancelModal
          activeSection={activeSection}
          closeModal={this.closeModal}
          onHide={() => this.setState({ showConfirmCancelModal: false })}
          isVisible={this.state.showConfirmCancelModal}
        />

        <CannotEditModal
          activeSection={activeSection}
          onHide={() => this.setState({ showCannotEditModal: false })}
          isVisible={this.state.showCannotEditModal}
        />

        <ConfirmRemoveModal
          cancelAction={this.cancelDeleteAction}
          deleteAction={this.confirmDeleteAction}
          isLoading={isLoading}
          title={title}
          fieldName={fieldName}
          isEnrolledInVAHealthCare={isEnrolledInVAHealthCare}
          isVisible={showRemoveModal}
          onHide={this.closeModal}
          error={error}
        />

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
  const showValidationView =
    addressValidationType === fieldName &&
    activeEditView === ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION;
  const isEnrolledInVAHealthCare = isVAPatient(state);
  const showSMSCheckbox =
    ownProps.fieldName === FIELD_NAMES.MOBILE_PHONE &&
    isEnrolledInVAHealthCare &&
    !showNotificationSettings(state);

  const {
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    title,
  } = getContactInfoFieldAttributes(fieldName);
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
      activeEditView === ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION
        ? addressValidationType
        : activeEditView,
    data,
    fieldName,
    showEditView: activeEditView === fieldName,
    showRemoveModal: activeEditView === `remove-${fieldName}`,
    showValidationView: !!showValidationView,
    isEmpty,
    transaction,
    transactionRequest,
    editViewData: selectEditViewData(state),
    showSMSCheckbox,
    title,
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    isEnrolledInVAHealthCare,
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createTransaction,
};

const ContactInformationFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInformationField);

export default ContactInformationFieldContainer;
export { ContactInformationField };
