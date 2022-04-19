import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
  selectMostRecentlyUpdatedField,
} from '@@vap-svc/selectors';

import { selectVAProfilePersonalInformation } from '@@profile/selectors';

import { ACTIVE_EDIT_VIEWS, FIELD_NAMES } from '@@vap-svc/constants';
import VAPServiceTransaction from '@@vap-svc/components/base/VAPServiceTransaction';
import AddressValidationView from '@@vap-svc/containers/AddressValidationView';

import ProfileInformationEditView from '@@profile/components/ProfileInformationEditView';
import ProfileInformationView from '@@profile/components/ProfileInformationView';

import { getInitialFormValues } from '@@profile/util/contact-information/formValues';
import { isVAPatient } from '~/platform/user/selectors';
import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';
import recordEvent from '~/platform/monitoring/record-event';
import { focusElement } from '~/platform/utilities/ui';

import getProfileInfoFieldAttributes from '~/applications/personalization/profile/util/getProfileInfoFieldAttributes';

import CannotEditModal from './ContactInformationFieldInfo/CannotEditModal';
import ConfirmCancelModal from './ContactInformationFieldInfo/ConfirmCancelModal';
import ConfirmRemoveModal from './ContactInformationFieldInfo/ConfirmRemoveModal';

import UpdateSuccessAlert from './ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

// Helper function that generates a string that can be used for a contact info
// field's edit button.
//
// Given a valid entry from the vap-svc/constants FIELD
// NAMES, it will return a string like `#edit-mobile-phone-number`
import { getEditButtonId } from '../util/id-factory';

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

class ProfileInformationFieldController extends React.Component {
  closeModalTimeoutID = null;

  constructor(props) {
    super(props);
    this.state = {
      showCannotEditModal: false,
      showConfirmCancelModal: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { fieldName, forceEditView, successCallback } = this.props;
    // Exit the edit view if it takes more than 5 seconds for the update/save
    // transaction to resolve. If the transaction has not resolved after 5
    // seconds we will show a "we're saving your new information..." message on
    // the Profile
    if (!prevProps.transaction && this.props.transaction) {
      this.closeModalTimeoutID = setTimeout(
        this.closeModal,
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
      } else if (this.props.showUpdateSuccessAlert) {
        focusElement('[data-testid=update-success-alert]');
        // Success check after confirming suggested address
        if (forceEditView && typeof successCallback === 'function') {
          successCallback();
        }
      } else {
        focusElement(`#${getEditButtonId(fieldName)}`);
      }
    } else if (
      forceEditView &&
      typeof successCallback === 'function' &&
      prevProps.transactionRequest &&
      !this.props.transactionRequest
    ) {
      // Success callback (non-address) after updating a field
      successCallback();
    }
  }

  onCancel = () => {
    this.captureEvent('cancel-button');

    if (!this.props.hasUnsavedEdits) {
      this.closeModal();
      // cancel form app inline editing. Allows changing route
      if (typeof this.props.cancelCallback === 'function') {
        this.props.cancelCallback();
      }
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
    this.closeModal();
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

  justClosedModal = (prevProps, props) => {
    return (
      (prevProps.showEditView && !props.showEditView) ||
      (prevProps.showRemoveModal && !props.showRemoveModal) ||
      (prevProps.showValidationView && !props.showValidationView)
    );
  };

  transactionJustFailed = (prevProps, props) => {
    const previousTransaction = prevProps.transaction;
    const currentTransaction = props.transaction;
    return (
      !isFailedTransaction(previousTransaction) &&
      isFailedTransaction(currentTransaction)
    );
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

  openRemoveModal = () => {
    if (this.props.blockEditMode) {
      this.setState({ showCannotEditModal: true });
      return;
    }
    this.props.openModal(`remove-${this.props.fieldName}`);
  };

  refreshTransactionNotProps = () => {
    this.props.refreshTransaction(
      this.props.transaction,
      this.props.analyticsSectionName,
    );
  };

  captureEvent = actionName => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': this.props.analyticsSectionName,
    });
  };

  isEditLinkVisible = () => !isPendingTransaction(this.props.transaction);

  handleDeleteInitiated = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'delete-button',
      'profile-section': this.props.analyticsSectionName,
    });
    this.openRemoveModal();
  };

  // When a personal information field contains initial field data from the api
  // we need to require that field, bc there are no deletes available at this time, and only updates
  requirePersonalInfoFieldBasedOnInitialValue = formSchema => {
    // TODO: handle multi-select values for when sexual orientation and pronouns are released
    const newFormSchema = { ...formSchema };
    const { fieldName, data, editViewData } = this.props;

    // only check field value if field is one of personal info fields
    if (
      Object.values(VAP_SERVICE.PERSONAL_INFO_FIELD_NAMES).includes(fieldName)
    ) {
      const initialValues = getInitialFormValues({
        fieldName,
        data,
        modalData: editViewData,
      });

      // only make the field required if there is an initial value for the field
      if (initialValues?.[fieldName]) {
        newFormSchema.required = [fieldName];
      }
    }
    return newFormSchema;
  };

  render() {
    const {
      activeEditView,
      fieldName,
      isEmpty,
      showEditView,
      forceEditView,
      isDeleteDisabled,
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
          isModalOpen={
            showEditView ||
            showValidationView ||
            showRemoveModal ||
            forceEditView
          }
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
        <ProfileInformationView
          data={data}
          fieldName={fieldName}
          title={title}
        />

        {this.props.showUpdateSuccessAlert ? (
          <div data-testid="update-success-alert">
            <UpdateSuccessAlert fieldName={fieldName} />
          </div>
        ) : null}

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
              !isDeleteDisabled &&
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

    if (showEditView || forceEditView) {
      content = (
        <ProfileInformationEditView
          getInitialFormValues={() =>
            getInitialFormValues({
              fieldName,
              data: this.props.data,
              modalData: this.props.editViewData,
            })
          }
          onCancel={this.onCancel}
          fieldName={this.props.fieldName}
          apiRoute={this.props.apiRoute}
          convertCleanDataToPayload={this.props.convertCleanDataToPayload}
          uiSchema={this.props.uiSchema}
          formSchema={this.requirePersonalInfoFieldBasedOnInitialValue(
            this.props.formSchema,
          )}
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

const shouldShowUpdateSuccessAlert = (state, field) => {
  const mostRecentSaveField = selectMostRecentlyUpdatedField(state);
  return Array.isArray(mostRecentSaveField)
    ? mostRecentSaveField.includes(field)
    : mostRecentSaveField === field;
};

ProfileInformationFieldController.defaultProps = {
  isDeleteDisabled: false,
};

ProfileInformationFieldController.propTypes = {
  analyticsSectionName: PropTypes.oneOf(
    Object.values(VAP_SERVICE.ANALYTICS_FIELD_MAP),
  ).isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  blockEditMode: PropTypes.bool.isRequired,
  clearTransactionRequest: PropTypes.func.isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  formSchema: PropTypes.object.isRequired,
  hasUnsavedEdits: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isEnrolledInVAHealthCare: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  showEditView: PropTypes.bool.isRequired,
  showValidationView: PropTypes.bool.isRequired,
  uiSchema: PropTypes.object.isRequired,
  activeEditView: PropTypes.string,
  cancelCallback: PropTypes.func,
  data: PropTypes.object,
  editViewData: PropTypes.object,
  forceEditView: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool,
  refreshTransaction: PropTypes.func,
  refreshTransactionRequest: PropTypes.func,
  showRemoveModal: PropTypes.bool,
  showUpdateSuccessAlert: PropTypes.bool,
  successCallback: PropTypes.func,
  title: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
};

export const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;

  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    fieldName,
  );
  const data =
    selectVAPContactInfoField(state, fieldName) ||
    selectVAProfilePersonalInformation(state, fieldName);

  const isEmpty = !data;
  const addressValidationType = selectAddressValidationType(state);
  const activeEditView = selectCurrentlyOpenEditModal(state);
  const showValidationView =
    addressValidationType === fieldName &&
    activeEditView === ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION;
  const isEnrolledInVAHealthCare = isVAPatient(state);

  const {
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    title,
  } = getProfileInfoFieldAttributes(fieldName);

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
    title,
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    isEnrolledInVAHealthCare,
    showUpdateSuccessAlert: shouldShowUpdateSuccessAlert(state, fieldName),
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createTransaction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileInformationFieldController);

export { ProfileInformationFieldController };
