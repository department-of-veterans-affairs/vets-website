import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { isEqual, omit } from 'lodash';
import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';
import ConfirmCancelModal from '~/platform/user/profile/vap-svc/components/ContactInformationFieldInfo/ConfirmCancelModal';
import { ACCOUNT_TYPES_OPTIONS } from '../../constants';
import { toggleDirectDepositEdit } from '../../actions/directDeposit';
import { BankNumberFaq } from './BankNumberFaq';

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
    'ui:widget': 'radio',
    'ui:title': 'Account type',
    'ui:errorMessages': {
      required: 'Please select the type that best describes your account',
    },
  },
  routingNumber: {
    'ui:title': 'Routing number',
    'ui:errorMessages': {
      pattern: 'Please enter your bank’s 9-digit routing number',
      required: 'Please enter your bank’s 9-digit routing number',
    },
  },
  accountNumber: {
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

export const AccountUpdateView = ({
  children,
  formData,
  formSubmit,
  setFormData,
  paymentAccount,
  cancelButtonClasses,
}) => {
  const [shouldShowCancelModal, setShouldShowCancelModal] = useState(false);
  const dispatch = useDispatch();

  const formCancel = useCallback(
    () => {
      const newFormData = omit(formData, 'view:directDepositInfo');

      if (!isEqual(newFormData, paymentAccount)) {
        setShouldShowCancelModal(true);
      } else {
        setFormData({});
        dispatch(toggleDirectDepositEdit(false));
      }
    },
    [formData, paymentAccount, setShouldShowCancelModal, dispatch, setFormData],
  );

  useEffect(
    () => {
      if (paymentAccount) {
        setFormData(paymentAccount);
      }
    },
    [paymentAccount, setFormData],
  );

  return (
    <>
      <strong>Account</strong>
      <SchemaForm
        addNameAttribute
        name="Direct Deposit Information"
        // title is required by the SchemaForm and used internally
        title="Direct Deposit Information"
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onChange={data => setFormData(data)}
        onSubmit={formSubmit}
      >
        {children}
      </SchemaForm>

      <va-button
        classNames={cancelButtonClasses}
        onClick={() => formCancel()}
        secondary
        text="Cancel"
      />

      <ConfirmCancelModal
        isVisible={shouldShowCancelModal}
        closeModal={() => {
          setShouldShowCancelModal(false);
          dispatch(toggleDirectDepositEdit(false));
        }}
        activeSection="direct deposit information"
        onHide={() => setShouldShowCancelModal(false)}
      />
    </>
  );
};

AccountUpdateView.propTypes = {
  formData: PropTypes.object.isRequired,
  formSubmit: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  cancelButtonClasses: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  formChange: PropTypes.func,
  paymentAccount: PropTypes.object,
};

AccountUpdateView.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default AccountUpdateView;
