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
import { usePrevious } from '~/platform/utilities/react-hooks';

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

const editButtonClasses = [
  'usa-button-primary',
  'vads-u-margin-right--0',
  'medium-screen:vads-u-margin-right--3',
  ...prefixUtilityClasses(['margin--0', 'margin-top--1p5']),
];

const classes = {
  wrapper: wrapperClasses.join(' '),
  editButton: editButtonClasses.join(' '),
};

function ContactInformationField({
  activeEditView,
  analyticsSectionName,
  apiRoute,
  blockEditMode,
  clearTransaction,
  convertCleanDataToPayload,
  createTransactionRequest,
  data,
  editViewData,
  fieldName,
  formSchema,
  hasUnsavedEdits,
  isEmpty,
  isEnrolledInVAHealthCare,
  openModalAlert,
  refreshTransactionRequest,
  showEditView,
  showSMSCheckBox,
  showValidationView,
  title,
  transaction,
  transactionRequest,
  uiSchema,
}) {
  const [focusDeleteAlert, setFocusDeleteAlert] = React.useState(false);
  const [showCannotEditModal, setShowCannotEditModal] = React.useState(false);
  const [showConfirmCancelModal, setShowConfirmCancelModal] = React.useState(
    false,
  );
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = React.useState(
    false,
  );
  const prevTransactionRef = usePrevious(transaction);
  const prevShowEditViewRef = usePrevious(showEditView);
  const prevShowValidationViewRef = usePrevious(showValidationView);
  let closeModalTimeoutID = null;

  const closeModal = () => {
    openModalAlert(null);
  };

  const transactionJustFailed = () => {
    return (
      !isFailedTransaction(prevTransactionRef) &&
      isFailedTransaction(transaction)
    );
  };

  const justClosedModal = () => {
    return (
      (prevShowEditViewRef && !showEditView) ||
      (prevShowValidationViewRef && !showValidationView)
    );
  };

  const captureEvent = actionName => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': actionName,
      'profile-section': analyticsSectionName,
    });
  };

  const isLoading =
    transactionRequest?.isPending || isPendingTransaction(transaction);

  React.useEffect(() => {
    const previousTransaction = prevTransactionRef;
    const currentTransaction = transaction;
    // Exit the edit view if it takes more than 5 seconds for the update/save
    // transaction to resolve. If the transaction has not resolved after 5
    // seconds we will show a "we're saving your new information..." message on
    // the Profile
    if (!previousTransaction && currentTransaction) {
      closeModalTimeoutID = setTimeout(
        () => {
          closeModal();
          setShowConfirmRemoveModal(false);
        },
        // Using 50ms as the unit test timeout before exiting edit view while
        // waiting for an update to happen. Being too aggressive, like 5ms,
        // results in exiting the edit view before Redux has had time to do
        // everything it needs to do. In that situation we see the "we're saving
        // your..." message while Redux is processing everything.
        window.VetsGov.pollTimeout ? 50 : 5000,
      );
    }
    // Do not auto-exit edit view if the transaction failed
    if (transactionJustFailed()) {
      clearTimeout(closeModalTimeoutID);
    }

    if (justClosedModal()) {
      clearTimeout(closeModalTimeoutID);
      if (transaction) {
        focusElement(`div#${fieldName}-transaction-status`);
      }
      focusElement(`#${getEditButtonId(fieldName)}`);
    }
  });

  React.useEffect(
    () => {
      if (focusDeleteAlert) {
        setFocusDeleteAlert(false);
      }
    },
    [focusDeleteAlert, setFocusDeleteAlert],
  );

  const onCancel = () => {
    captureEvent('cancel-button');

    if (!hasUnsavedEdits) {
      closeModal();
      return;
    }
    setShowConfirmCancelModal(true);
  };

  const cancelDeleteAction = () => {
    setShowConfirmRemoveModal(false);
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'cancel-delete-button',
      'profile-section': analyticsSectionName,
    });
  };

  const onDelete = () => {
    let payload = data;
    if (convertCleanDataToPayload) {
      payload = convertCleanDataToPayload(payload, fieldName);
    }
    createTransactionRequest(
      apiRoute,
      'DELETE',
      fieldName,
      payload,
      analyticsSectionName,
    );
  };

  const confirmDeleteAction = e => {
    e.preventDefault();
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'confirm-delete-button',
      'profile-section': analyticsSectionName,
    });
    onDelete();
  };

  const clearErrors = () => {
    clearTransaction(fieldName);
  };

  const openEditModal = () => {
    if (blockEditMode) {
      setShowCannotEditModal(true);
    } else {
      openModalAlert(fieldName);
    }
  };

  const onEdit = (event = 'edit-link') => {
    captureEvent(event);
    openEditModal();
  };

  const refreshTransactionNotProps = () => {
    refreshTransactionRequest(transaction, analyticsSectionName);
  };

  const isEditLinkVisible = () => !isPendingTransaction(transaction);

  const handleDeleteInitiated = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'delete-button',
      'profile-section': analyticsSectionName,
    });
    setShowConfirmRemoveModal(true);
  };

  const activeSection = VAP_SERVICE.FIELD_TITLES[activeEditView]?.toLowerCase();

  const wrapInTransaction = children => {
    return (
      <VAPServiceTransaction
        isModalOpen={showEditView || showValidationView}
        id={`${fieldName}-transaction-status`}
        title={title}
        transaction={transaction}
        transactionRequest={transactionRequest}
        refreshTransaction={refreshTransactionNotProps}
      >
        {children}
      </VAPServiceTransaction>
    );
  };

  // default the content to the read-view
  let content = wrapInTransaction(
    <div className={classes.wrapper}>
      <ContactInformationView data={data} fieldName={fieldName} title={title} />

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-flex-direction--column vads-u-width--full">
        <div>
          {isEditLinkVisible() && (
            <button
              aria-label={`Edit ${title}`}
              type="button"
              data-action="edit"
              onClick={() => {
                onEdit(isEmpty ? 'add-link' : 'edit-link');
              }}
              id={getEditButtonId(fieldName)}
            >
              Edit
            </button>
          )}
          {data &&
            fieldName !== FIELD_NAMES.MAILING_ADDRESS && (
              <button
                type="button"
                className="small-screen:vads-u-margin--0 usa-button-secondary"
                onClick={handleDeleteInitiated}
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
            data,
            showSMSCheckBox,
            modalData: editViewData,
          })
        }
        onCancel={onCancel}
        fieldName={fieldName}
        apiRoute={apiRoute}
        convertCleanDataToPayload={convertCleanDataToPayload}
        uiSchema={uiSchema}
        formSchema={formSchema}
        title={title}
      />
    );
  }

  if (showValidationView) {
    content = (
      <AddressValidationView
        refreshTransaction={refreshTransactionNotProps}
        transaction={transaction}
        transactionRequest={transactionRequest}
        title={title}
        clearErrors={clearErrors}
      />
    );
  }

  return (
    <div
      className="vet360-profile-field"
      data-field-name={fieldName}
      data-testid={fieldName}
    >
      <ConfirmCancelModal
        activeSection={activeSection}
        closeModal={closeModal}
        onHide={() => setShowConfirmCancelModal(false)}
        isVisible={showConfirmCancelModal}
      />

      <CannotEditModal
        activeSection={activeSection}
        onHide={() => setShowCannotEditModal(false)}
        isVisible={showCannotEditModal}
      />

      <ConfirmRemoveModal
        cancelAction={cancelDeleteAction}
        deleteAction={confirmDeleteAction}
        isLoading={isLoading}
        title={title}
        fieldName={fieldName}
        isEnrolledInVAHealthCare={isEnrolledInVAHealthCare}
        isVisible={showConfirmRemoveModal}
        onHide={() => setShowConfirmRemoveModal(false)}
      />

      {content}
    </div>
  );
}

ContactInformationField.propTypes = {
  activeEditView: PropTypes.string,
  analyticsSectionName: PropTypes.oneOf(
    Object.values(VAP_SERVICE.ANALYTICS_FIELD_MAP),
  ).isRequired,
  apiRoute: PropTypes.oneOf(Object.values(VAP_SERVICE.API_ROUTES)).isRequired,
  blockEditMode: PropTypes.bool.isRequired,
  clearTransaction: PropTypes.func.isRequired,
  convertCleanDataToPayload: PropTypes.func.isRequired,
  createTransactionRequest: PropTypes.func.isRequired,
  data: PropTypes.object,
  editViewData: PropTypes.object,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
  formSchema: PropTypes.object.isRequired,
  hasUnsavedEdits: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isEnrolledInVAHealthCare: PropTypes.bool.isRequired,
  openModalAlert: PropTypes.func.isRequired,
  refreshTransactionRequest: PropTypes.func.isRequired,
  showEditView: PropTypes.bool.isRequired,
  showSMSCheckBox: PropTypes.bool,
  showValidationView: PropTypes.bool.isRequired,
  title: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
  uiSchema: PropTypes.object.isRequired,
};

ContactInformationField.defaultProps = {
  fieldName: '',
  hasUnsavedEdits: false,
};

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
  const showSMSCheckBox =
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
    showValidationView: !!showValidationView,
    isEmpty,
    transaction,
    transactionRequest,
    editViewData: selectEditViewData(state),
    showSMSCheckBox,
    title,
    apiRoute,
    convertCleanDataToPayload,
    uiSchema,
    formSchema,
    isEnrolledInVAHealthCare,
  };
};

const mapDispatchToProps = {
  clearTransaction: clearTransactionRequest,
  refreshTransactionRequest: refreshTransaction,
  openModalAlert: openModal,
  createTransactionRequest: createTransaction,
};

const ContactInformationFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInformationField);

export default ContactInformationFieldContainer;
export { ContactInformationField };
