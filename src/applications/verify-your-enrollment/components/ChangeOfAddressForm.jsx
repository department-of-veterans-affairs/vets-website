import React from 'react';
import PropTypes from 'prop-types';

import {
  getFormSchema,
  getUiSchema,
} from '@@vap-svc/components/AddressField/address-schemas';
// /home/jarred/Desktop/VA_REPOS/vets-website/src/platform/user/profile/vap-svc/components/AddressField/address-schemas.js
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';

export function makeFormProperties(prefix) {
  return {
    accountType: `${prefix}AccountType`,
    routingNumber: `${prefix}RoutingNumber`,
    accountNumber: `${prefix}AccountNumber`,
    verifyAccountNumber: `${prefix}VerifyAccountNumber`,
    bankName: `${prefix}BankName`,
    bankPhone: `${prefix}BankPhone`,
  };
}

const ChangeOfAddressWrapper = ({
  children,
  formChange,
  formData,
  // formPrefix,
  formSubmit,
}) => {
  //   const { schema, uiSchema } = makeSchemas(formPrefix);
  const addressSchema = getFormSchema();
  const addressUISchema = getUiSchema();

  return (
    <SchemaForm
      addNameAttribute
      name="Direct Deposit Information"
      // title is required by the SchemaForm and used internally
      title="Direct Deposit Information"
      schema={addressSchema}
      uiSchema={addressUISchema}
      data={formData}
      onChange={formChange}
      onSubmit={formSubmit}
      data-testid="change-of-address-form"
    >
      {children}
    </SchemaForm>
  );
};

ChangeOfAddressWrapper.propTypes = {
  formChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  // Prefix to apply to all the form's schema fields
  formPrefix: PropTypes.string.isRequired,
  formSubmit: PropTypes.func.isRequired,
  cancelButtonClasses: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

ChangeOfAddressWrapper.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default ChangeOfAddressWrapper;
