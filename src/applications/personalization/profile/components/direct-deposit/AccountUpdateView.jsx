import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';
import ConfirmCancelModal from '~/platform/user/profile/vap-svc/components/ContactInformationFieldInfo/ConfirmCancelModal';
import { ACCOUNT_TYPES_OPTIONS } from '../../constants';
import { BankNumberFaq } from './BankNumberFaq';
import {
  VaTextInputField,
  VaRadioField,
} from '~/platform/forms-system/src/js/web-component-fields';
import { UpdateErrorAlert } from './alerts/UpdateErrorAlert';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

const schema = {
  type: 'object',
  properties: {
    accountType: {
      type: 'string',
      enum: Object.values(ACCOUNT_TYPES_OPTIONS),
    },
    routingNumber: {
      type: 'string',
      pattern: '^\\d{9}$',
    },
    accountNumber: {
      type: 'string',
      pattern: '^\\d{1,17}$',
    },
    'view:directDepositInfo': {
      type: 'object',
      properties: {},
    },
  },
  required: ['accountType', 'routingNumber', 'accountNumber'],
};

const uiSchema = {
  'ui:description':
    'Please provide your bank’s routing number as well as your current account and type.',

  accountType: {
    'ui:webComponentField': VaRadioField,
    'ui:title': 'Account type',
    'ui:errorMessages': {
      required: 'Please select the type that best describes your account',
    },
  },
  routingNumber: {
    'ui:webComponentField': VaTextInputField,
    'ui:title': 'Routing number',
    'ui:errorMessages': {
      pattern: 'Please enter your bank’s 9-digit routing number',
      required: 'Please enter your bank’s 9-digit routing number',
    },
  },
  accountNumber: {
    'ui:webComponentField': VaTextInputField,
    'ui:title': 'Account number (No more than 17 digits)',
    'ui:errorMessages': {
      pattern: 'Please enter your account number',
      required: 'Please enter your account number',
    },
  },
  'view:directDepositInfo': {
    'ui:description': BankNumberFaq,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const AccountUpdateView = props => {
  // all props used come from the result of the useDirectDeposit hook
  const {
    formData,
    formSubmit,
    setFormData,
    isSaving,
    saveError,
    onCancel,
    showCancelModal,
    setShowCancelModal,
    exitUpdateView,
  } = props;
  return (
    <>
      <p className="vads-u-font-size--md vads-u-font-weight--bold vads-u-margin-y--0">
        Account
      </p>
      <UpdateErrorAlert
        saveError={saveError}
        className="vads-u-margin-top--2"
      />

      <SchemaForm
        addNameAttribute
        name="Bank Account Information"
        // title is required by the SchemaForm and used internally
        title="Bank Account Information"
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onChange={data => setFormData(data)}
        onSubmit={formSubmit}
      >
        <LoadingButton
          aria-label="save your bank information for benefits"
          type="submit"
          loadingText="saving bank information"
          className="usa-button-primary vads-u-margin-top--0 medium-screen:vads-u-width--auto"
          isLoading={isSaving}
        >
          Save
        </LoadingButton>
        <va-button onClick={onCancel} secondary text="Cancel" />
      </SchemaForm>

      <ConfirmCancelModal
        isVisible={!!showCancelModal}
        closeModal={exitUpdateView}
        activeSection="direct deposit information"
        onHide={() => setShowCancelModal(false)}
      />
    </>
  );
};

AccountUpdateView.propTypes = {
  exitUpdateView: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  formSubmit: PropTypes.func.isRequired,
  hasUnsavedFormEdits: PropTypes.bool.isRequired,
  setFormData: PropTypes.func.isRequired,
  setShowCancelModal: PropTypes.func.isRequired,
  showCancelModal: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  formChange: PropTypes.func,
  isSaving: PropTypes.bool,
  saveError: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.string,
  ]),
};

export default AccountUpdateView;
