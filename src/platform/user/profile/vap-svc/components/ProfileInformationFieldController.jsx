import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// platform level imports
import recordEvent from '../../../../monitoring/record-event';
import { isVAPatient } from '../../../selectors';
import { waitForRenderThenFocus } from '../../../../utilities/ui';
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
  selectVAProfileSchedulingPreferences,
} from '../selectors';

import { isFieldEmpty } from '../util';
import { recordCustomProfileEvent } from '../util/analytics';
import { getInitialFormValues } from '../util/contact-information/formValues';
import getProfileInfoFieldAttributes from '../util/getProfileInfoFieldAttributes';
import {
  isSchedulingPreference,
  isSubtaskSchedulingPreference,
} from '../util/health-care-settings/schedulingPreferencesUtils';
import { createSchedulingPreferencesUpdate } from '../actions/schedulingPreferences';

// Helper function that generates a string that can be used for a contact info
// field's edit button.
//
// Given a valid entry from the vap-svc/constants FIELD
// NAMES, it will return a string like `#edit-mobile-phone-number`
import { getEditButtonId, getRemoveButtonId } from '../util/id-factory';
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
import GenericErrorAlert from './GenericErrorAlert';

import ProfileInformationView from './ProfileInformationView';
import ProfileInformationEditView from './ProfileInformationEditView';
import { updateMessagingSignature } from '../../actions/mhv';
import ProfileInformationEditViewFc from './ProfileInformationEditViewFc';
import { SCHEDULING_PREF_PATHS } from '../constants/schedulingPreferencesConstants';

const wrapperClasses = prefixUtilityClasses([
  'display--flex',
  'flex-direction--column',
  'align-items--flex-start',
]);

const classes = {
  wrapper: wrapperClasses.join(' '),
  buttons:
    'vads-u-margin-bottom--1 vads-u-width--full mobile-lg:vads-u-width--auto',
};

const hasError = (transaction, transactionRequest) => {
  return transactionRequest?.isFailed || isFailedTransaction(transaction);
};

class ProfileInformationFieldController extends React.Component {
  closeModalTimeoutID = null;

  constructor(props) {
    super(props);
    this.state = {
      showCannotEditModal: false,
      showConfirmCancelModal: false,
      shouldFocusCancelButton: false,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      fieldName,
      forceEditView,
      successCallback,
      showUpdateSuccessAlert,
      showErrorAlert,
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

    // Exit the remove modal if the delete transaction failed
    if (
      prevProps.showRemoveModal &&
      this.props.showRemoveModal &&
      this.transactionJustFailed(prevProps, this.props)
    ) {
      clearTimeout(this.closeModalTimeoutID);
      this.closeModal();
    }

    if (this.justClosedModal(prevProps, this.props)) {
      clearTimeout(this.closeModalTimeoutID);
      if (showErrorAlert || showUpdateSuccessAlert) {
        // Focus on whichever alert is showing for the current field (success or error)
        // Use async check for modal state to avoid focusing on alert while a modal is open (e.g. copy address flow)
        this.shouldFocusAlert().then(shouldFocus => {
          if (shouldFocus) {
            waitForRenderThenFocus(
              `[data-field-name="${fieldName}"] va-alert`,
              document,
              50,
            );
          }
        });
        // Handle success callback for success alerts
        if (
          forceEditView &&
          typeof successCallback === 'function' &&
          showUpdateSuccessAlert
        ) {
          successCallback();
        }
      } else if (!forceEditView) {
        if (prevProps.showRemoveModal && !this.props.showRemoveModal) {
          // Focus on the remove button after exiting the remove modal without saving
          waitForRenderThenFocus(
            `#${getRemoveButtonId(fieldName)}`,
            document,
            50,
            'button',
          );
        } else {
          // Focus on the edit button after exiting the edit or validation modal without saving
          // focusElement did not work here on iphone or safari, so using waitForRenderThenFocus
          waitForRenderThenFocus(
            `#${getEditButtonId(fieldName)}`,
            document,
            50,
            'button',
          );
        }
      }
    } else if (
      !this.isAnyModalOpen() &&
      ((!prevProps.showUpdateSuccessAlert && showUpdateSuccessAlert) ||
        (!prevProps.showErrorAlert && showErrorAlert))
    ) {
      // Success or error alert just appeared after a modal closed during a pending transaction
      waitForRenderThenFocus(
        `[data-field-name="${fieldName}"] va-alert`,
        document,
        50,
      );

      if (
        forceEditView &&
        typeof successCallback === 'function' &&
        showUpdateSuccessAlert &&
        !prevProps.showUpdateSuccessAlert
      ) {
        successCallback();
      }
    } else if (
      forceEditView &&
      typeof successCallback === 'function' &&
      prevProps.transactionRequest &&
      !this.props.transactionRequest
    ) {
      // forceEditView will result in now standard edit button being rendered, so we don't want to focus on it
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
    const { fieldName, apiRoute, analyticsSectionName } = this.props;
    if (this.props.convertCleanDataToPayload) {
      payload = this.props.convertCleanDataToPayload(payload, fieldName);
    }
    if (isSchedulingPreference(fieldName)) {
      this.props.createSchedulingPreferencesUpdate({
        route: apiRoute,
        method: 'DELETE',
        fieldName,
        payload,
        analyticsSectionName,
        value: payload,
      });
      this.closeModal();
      return;
    }
    if (fieldName === FIELD_NAMES.MESSAGING_SIGNATURE) {
      this.props.updateMessagingSignature(
        {
          signatureName: '',
          signatureTitle: '',
          includeSignature: false,
        },
        fieldName,
        'POST',
      );
    } else {
      this.props.createTransaction(
        apiRoute,
        'DELETE',
        fieldName,
        payload,
        analyticsSectionName,
      );
    }
    this.closeModal();
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
    // Check if this field should use subtask editing
    if (
      isSubtaskSchedulingPreference(this.props.fieldName) &&
      this.props.history
    ) {
      switch (this.props.fieldName) {
        case VAP_SERVICE.FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD:
          this.props.history.push(SCHEDULING_PREF_PATHS.CONTACT_METHOD);
          break;
        case VAP_SERVICE.FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES:
          this.props.history.push(SCHEDULING_PREF_PATHS.CONTACT_TIMES);
          break;
        case VAP_SERVICE.FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES:
          this.props.history.push(SCHEDULING_PREF_PATHS.APPOINTMENT_TIMES);
          break;
        default:
          return;
      }
      return;
    }
    // Use inline editing flow
    this.openEditModal();
  };

  justClosedModal = (prevProps, props) => {
    return (
      (prevProps.showEditView && !props.showEditView) ||
      (prevProps.showRemoveModal && !props.showRemoveModal) ||
      (prevProps.showValidationView && !props.showValidationView)
    );
  };

  isAnyModalOpen = () => {
    const openModals = document.querySelectorAll(
      'va-modal[visible="true"], va-modal[visible]',
    );
    return openModals.length > 0;
  };

  shouldFocusAlert = () => {
    if (this.isAnyModalOpen()) {
      return false;
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(!this.isAnyModalOpen());
      }, 100);
    });
  };

  transactionJustFailed = (prevProps, props) => {
    const hadPreviousError = hasError(
      prevProps.transaction,
      prevProps.transactionRequest,
    );
    const hasCurrentError = hasError(
      props.transaction,
      props.transactionRequest,
    );
    return !hadPreviousError && hasCurrentError;
  };

  closeModal = () => {
    this.props.openModal(null);
  };

  openEditModal = () => {
    if (this.props.blockEditMode) {
      this.setState({ showCannotEditModal: true });
    } else {
      // Clear errors on open to prevent showing an alert from a previous transaction
      this.clearErrors();
      this.props.openModal(this.props.fieldName);
    }
  };

  openRemoveModal = () => {
    if (this.props.blockEditMode) {
      this.setState({ showCannotEditModal: true });
      return;
    }
    // Clear errors on open to prevent showing an alert from a previous transaction
    this.clearErrors();
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

  getEditViewProps = () => {
    const baseProps = {
      getInitialFormValues: () =>
        getInitialFormValues({
          fieldName: this.props.fieldName,
          data: this.props.data,
          modalData: this.props.editViewData,
        }),
      onCancel: this.onCancel,
      fieldName: this.props.fieldName,
      apiRoute: this.props.apiRoute,
      convertCleanDataToPayload: this.props.convertCleanDataToPayload,
      uiSchema: this.props.uiSchema,
      formSchema: this.requireFieldBasedOnInitialValue(this.props.formSchema),
      title: this.props.title,
      recordCustomProfileEvent,
      forceEditView: this.props.forceEditView,
      cancelButtonText: this.props?.cancelButtonText,
      saveButtonText: this.props?.saveButtonText,
      showMailingAddressUpdateProfileChoice:
        this.props?.prefillPatternEnabled &&
        this.props?.fieldName === FIELD_NAMES.MAILING_ADDRESS,
      successCallback: this.props.successCallback,
      // shouldFocusCancelButton and onCancelButtonFocused are used to set focus on the
      // cancel button after the user returns to edit view from the confirm/cancel modal
      shouldFocusCancelButton: this.state.shouldFocusCancelButton,
      onCancelButtonFocused: () =>
        this.setState({ shouldFocusCancelButton: false }),
      allowInternationalPhones: this.props.allowInternationalPhones,
    };

    // Add flag for email/phone fields to indicate they should use formOnlyUpdate
    if (
      [
        FIELD_NAMES.EMAIL,
        FIELD_NAMES.HOME_PHONE,
        FIELD_NAMES.MOBILE_PHONE,
      ].includes(this.props.fieldName) ||
      (this.props?.prefillPatternEnabled &&
        this.props?.fieldName === FIELD_NAMES.MAILING_ADDRESS)
    ) {
      return {
        ...baseProps,
        useFormOnlyUpdate: true, // Flag to indicate this field should use formOnlyUpdate
      };
    }

    return baseProps;
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
      showUpdateSuccessAlert,
      showErrorAlert,
      showCopyAddressModal,
    } = this.props;

    // If the activeEditView is on the scheduling preferences page, use the section heading for modals
    const activeSection = isSchedulingPreference(activeEditView)
      ? VAP_SERVICE.FIELD_SECTION_HEADERS[activeEditView]?.toLowerCase()
      : VAP_SERVICE.FIELD_TITLES[activeEditView]?.toLowerCase();

    const isLoading =
      transactionRequest?.isPending || isPendingTransaction(transaction);

    const wrapInTransaction = children => {
      return (
        <VAPServiceTransaction
          isModalOpen={
            showEditView ||
            showValidationView ||
            showRemoveModal ||
            forceEditView ||
            showCopyAddressModal
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
        {showErrorAlert && (
          <div className="vads-u-width--full">
            <GenericErrorAlert fieldName={fieldName} />
          </div>
        )}

        {showUpdateSuccessAlert && (
          <div className="vads-u-width--full">
            <UpdateSuccessAlert fieldName={fieldName} />
          </div>
        )}

        <ProfileInformationView
          data={data}
          fieldName={fieldName}
          title={title}
          id={ariaDescribedBy}
          email={this.props.email}
          mailingAddress={this.props.mailingAddress}
          mobilePhone={this.props.mobilePhone}
          homePhone={this.props.homePhone}
          workPhone={this.props.workPhone}
        />
        <div className="vads-u-width--full">
          <div>
            {!isLoading && (
              <va-button
                text="Edit"
                label={`Edit ${title}`}
                message-aria-describedby={ariaDescribedBy}
                onClick={() => {
                  this.onEdit(isEmpty ? 'add-link' : 'edit-link');
                }}
                id={getEditButtonId(fieldName)}
                class={`vads-u-margin-top--1p5 ${classes.buttons}`}
                primary
              />
            )}
            {data &&
              !isLoading &&
              !isDeleteDisabled &&
              fieldName !== FIELD_NAMES.MAILING_ADDRESS && (
                <va-button
                  text="Remove"
                  label={`Remove ${title}`}
                  id={getRemoveButtonId(fieldName)}
                  class={`vads-u-margin-top--1 ${classes.buttons}`}
                  onClick={this.handleDeleteInitiated}
                  secondary
                />
              )}
          </div>
        </div>
      </div>,
    );

    if (showEditView || forceEditView) {
      if (
        this.props?.prefillPatternEnabled &&
        this.props?.fieldName === FIELD_NAMES.MAILING_ADDRESS
      ) {
        content = <ProfileInformationEditViewFc {...this.getEditViewProps()} />;
      } else {
        content = <ProfileInformationEditView {...this.getEditViewProps()} />;
      }
    }

    if (showValidationView) {
      content = (
        <AddressValidationView
          refreshTransaction={this.refreshTransactionNotProps}
          transaction={transaction}
          transactionRequest={transactionRequest}
          title={title}
          clearErrors={this.clearErrors}
          successCallback={this.props.successCallback}
        />
      );
    }

    const error =
      transactionRequest?.error ||
      (isFailedTransaction(transaction) ? {} : null);

    return (
      <div data-field-name={fieldName} data-testid={fieldName}>
        {CustomConfirmCancelModal ? (
          <CustomConfirmCancelModal
            activeSection={activeSection}
            isVisible={this.state.showConfirmCancelModal}
            onHide={() =>
              this.setState({
                showConfirmCancelModal: false,
                shouldFocusCancelButton: true,
              })
            }
          />
        ) : (
          <ConfirmCancelModal
            activeSection={activeSection}
            closeModal={this.closeModal}
            onHide={() =>
              this.setState({
                showConfirmCancelModal: false,
                shouldFocusCancelButton: true,
              })
            }
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

const shouldShowErrorAlert = (state, field) => {
  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    field,
  );
  return hasError(transaction, transactionRequest);
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
  createSchedulingPreferencesUpdate: PropTypes.func.isRequired,
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
  CustomConfirmCancelModal: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.node,
  ]),
  activeEditView: PropTypes.string,
  allowInternationalPhones: PropTypes.bool, // "opt-in" param for international phone numbers
  ariaDescribedBy: PropTypes.string,
  cancelButtonText: PropTypes.string,
  cancelCallback: PropTypes.func,
  contactInfoFormAppConfig: PropTypes.object,
  data: PropTypes.object,
  editViewData: PropTypes.object,
  email: PropTypes.object,
  forceEditView: PropTypes.bool,
  history: PropTypes.object,
  homePhone: PropTypes.object,
  isDeleteDisabled: PropTypes.bool,
  mailingAddress: PropTypes.object,
  mobilePhone: PropTypes.object,
  prefillPatternEnabled: PropTypes.bool,
  recordCustomProfileEvent: PropTypes.func,
  refreshTransaction: PropTypes.func,
  refreshTransactionRequest: PropTypes.func,
  saveButtonText: PropTypes.string,
  shouldFocusCancelButton: PropTypes.bool,
  showCopyAddressModal: PropTypes.bool,
  showErrorAlert: PropTypes.bool,
  showRemoveModal: PropTypes.bool,
  showUpdateSuccessAlert: PropTypes.bool,
  successCallback: PropTypes.func,
  title: PropTypes.string,
  transaction: PropTypes.object,
  transactionRequest: PropTypes.object,
  updateMessagingSignature: PropTypes.func,
  workPhone: PropTypes.object,
  onCancelButtonFocused: PropTypes.func,
};

export const mapStateToProps = (state, ownProps) => {
  const { fieldName, allowInternationalPhones = false } = ownProps;

  const internationalPhonesToggleValue =
    state.featureToggles?.profileInternationalPhoneNumbers || false;
  const enableInternationalPhones =
    allowInternationalPhones && internationalPhonesToggleValue;

  const { transaction, transactionRequest } = selectVAPServiceTransaction(
    state,
    fieldName,
  );
  const data =
    selectVAPContactInfoField(state, fieldName) ||
    selectVAProfilePersonalInformation(state, fieldName) ||
    selectVAProfileSchedulingPreferences(state, fieldName);

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
  } = getProfileInfoFieldAttributes(fieldName, {
    allowInternationalPhones: enableInternationalPhones,
  });

  // Override the uiSchema title if a custom title is provided
  let customUiSchema = uiSchema;
  if (ownProps.title) {
    if (uiSchema?.inputPhoneNumber?.['ui:title']) {
      // Handle phone fields
      customUiSchema = {
        ...uiSchema,
        inputPhoneNumber: {
          ...uiSchema.inputPhoneNumber,
          'ui:title': ownProps.title,
        },
      };
    } else if (uiSchema?.emailAddress?.['ui:title']) {
      // Handle email fields
      customUiSchema = {
        ...uiSchema,
        emailAddress: {
          ...uiSchema.emailAddress,
          'ui:title': ownProps.title,
        },
      };
    }
  }

  const hasUnsavedEdits = state.vapService?.hasUnsavedEdits;

  const showCopyAddressModal =
    fieldName === VAP_SERVICE.FIELD_NAMES.MAILING_ADDRESS
      ? !!state.vapService?.copyAddressModal
      : false;

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
    title: ownProps.title || title, // Use custom title if provided, otherwise use default
    apiRoute,
    convertCleanDataToPayload,
    uiSchema: customUiSchema,
    formSchema,
    isEnrolledInVAHealthCare,
    showUpdateSuccessAlert: shouldShowUpdateSuccessAlert(state, fieldName),
    showErrorAlert: shouldShowErrorAlert(state, fieldName),
    showCopyAddressModal,
    email: selectVAPContactInfoField(state, 'email'),
    mailingAddress: selectVAPContactInfoField(state, 'mailingAddress'),
    mobilePhone: selectVAPContactInfoField(state, 'mobilePhone'),
    homePhone: selectVAPContactInfoField(state, 'homePhone'),
    workPhone: selectVAPContactInfoField(state, 'workPhone'),
  };
};

const mapDispatchToProps = {
  clearTransactionRequest,
  refreshTransaction,
  openModal,
  createSchedulingPreferencesUpdate,
  createTransaction,
  updateMessagingSignature,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileInformationFieldController);

const RoutedProfileInformationFieldController = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ProfileInformationFieldController));

export {
  ProfileInformationFieldController,
  RoutedProfileInformationFieldController,
};
