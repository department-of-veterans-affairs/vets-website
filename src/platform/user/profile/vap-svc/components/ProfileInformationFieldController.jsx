import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// platform level imports
import recordEvent from '../../../../monitoring/record-event';
import { isVAPatient } from '../../../selectors';
import { focusElement, waitForRenderThenFocus } from '../../../../utilities/ui';
import prefixUtilityClasses from '../../../../utilities/prefix-utility-classes';

// local level imports
import {
  createTransaction,
  refreshTransaction,
  clearTransactionRequest,
  openModal,
} from '../actions';

import * as VAP_SERVICE from '../constants';
import { ACTIVE_EDIT_VIEWS, FIELD_NAMES } from '../constants';

import {
  selectAddressValidationType,
  selectCurrentlyOpenEditModal,
  selectVAPContactInfoField,
  selectVAPServiceTransaction,
  selectEditViewData,
  selectMostRecentlyUpdatedField,
  selectVAProfilePersonalInformation,
} from '../selectors';

import { isFieldEmpty } from '../util';
import { recordCustomProfileEvent } from '../util/analytics';
import { getInitialFormValues } from '../util/contact-information/formValues';
import getProfileInfoFieldAttributes from '../util/getProfileInfoFieldAttributes';
// Helper function that generates a string that can be used for a contact info
// field's edit button.
//
// Given a valid entry from the vap-svc/constants FIELD
// NAMES, it will return a string like `#edit-mobile-phone-number`
import { getEditButtonId } from '../util/id-factory';
import {
  isFailedTransaction,
  isPendingTransaction,
} from '../util/transactions';

// component imports
import VAPServiceTransaction from './base/VAPServiceTransaction';
import AddressValidationView from '../containers/AddressValidationView';

import CannotEditModal from './ContactInformationFieldInfo/CannotEditModal';
import ConfirmCancelModal from './ContactInformationFieldInfo/ConfirmCancelModal';
import ConfirmRemoveModal from './ContactInformationFieldInfo/ConfirmRemoveModal';
import UpdateSuccessAlert from './ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

import ProfileInformationView from './ProfileInformationView';
import ProfileInformationEditView from './ProfileInformationEditView';

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
    const {
      fieldName,
      forceEditView,
      successCallback,
      showUpdateSuccessAlert,
    } = this.props;
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

    // component should clear timeout if the showUpdateSuccessAlert is set to true
    // this is used to prevent the alerts from disappearing when a user directly updates
    // their mailing address from the home address flow
    if (showUpdateSuccessAlert) {
      clearTimeout(this.closeModalTimeoutID);
    }

    // Do not auto-exit edit view if the transaction failed
    if (this.transactionJustFailed(prevProps, this.props)) {
      clearTimeout(this.closeModalTimeoutID);
    }
    if (this.justClosedModal(prevProps, this.props)) {
      clearTimeout(this.closeModalTimeoutID);
      if (this.props.transaction) {
        focusElement(`div#${fieldName}-transaction-status`);
      } else if (showUpdateSuccessAlert) {
        // Success check after confirming suggested address
        if (forceEditView && typeof successCallback === 'function') {
          successCallback();
        }
      } else if (!forceEditView) {
        // forcesEditView will result in now standard edit button being rendered, so we don't want to focus on it
        // focusElement did not work here on iphone or safari, so using waitForRenderThenFocus
        waitForRenderThenFocus(`#${getEditButtonId(fieldName)}`, document, 50);
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

  // only require certain fields based on initial data from api on that field
  requireFieldBasedOnInitialValue = formSchema => {
    const activeFields = [
      VAP_SERVICE.PERSONAL_INFO_FIELD_NAMES.GENDER_IDENTITY,
    ];

    // TODO: handle multi-select values for when sexual orientation and pronouns are released
    const newFormSchema = { ...formSchema };
    const { fieldName, data, editViewData } = this.props;

    // only check field value if field is one of personal info fields
    if (Object.values(activeFields).includes(fieldName)) {
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
      ariaDescribedBy,
      CustomConfirmCancelModal,
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
          id={ariaDescribedBy}
        />

        {this.props.showUpdateSuccessAlert ? (
          <div
            data-testid="update-success-alert"
            className="vads-u-width--full"
          >
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
                aria-describedby={ariaDescribedBy}
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
          formSchema={this.requireFieldBasedOnInitialValue(
            this.props.formSchema,
          )}
          title={title}
          recordCustomProfileEvent={recordCustomProfileEvent}
          forceEditView={forceEditView}
          cancelButtonText={this.props?.cancelButtonText}
          saveButtonText={this.props?.saveButtonText}
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
        {CustomConfirmCancelModal ? (
          <>
            <CustomConfirmCancelModal
              activeSection={activeSection}
              isVisible={this.state.showConfirmCancelModal}
              onHide={() => this.setState({ showConfirmCancelModal: false })}
            />
          </>
        ) : (
          <ConfirmCancelModal
            activeSection={activeSection}
            closeModal={this.closeModal}
            onHide={() => this.setState({ showConfirmCancelModal: false })}
            isVisible={this.state.showConfirmCancelModal}
          />
        )}

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
  ariaDescribedBy: PropTypes.string,
  cancelButtonText: PropTypes.string,
  cancelCallback: PropTypes.func,
  CustomConfirmCancelModal: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.node,
  ]),
  data: PropTypes.object,
  editViewData: PropTypes.object,
  forceEditView: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool,
  refreshTransaction: PropTypes.func,
  refreshTransactionRequest: PropTypes.func,
  saveButtonText: PropTypes.string,
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

  const isEmpty = isFieldEmpty(data, fieldName);
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

  const hasUnsavedEdits = state.vapService?.hasUnsavedEdits;
  return {
    hasUnsavedEdits,
    analyticsSectionName: VAP_SERVICE.ANALYTICS_FIELD_MAP[fieldName],
    blockEditMode: !!(activeEditView && hasUnsavedEdits),
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
