/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );
  const dataPostTransform = {
    veteran: {
      date_of_birth: transformedData.veteranDateOfBirth || '',
      full_name: transformedData?.veteranFullName || {},
      physical_address: transformedData.physicalAddress || {
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
        country: 'NA',
      },
      mailing_address: transformedData.veteranAddress || {
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
        country: 'NA',
      },
      ssn: transformedData?.veteranSocialSecurityNumber?.ssn || '',
      va_claim_number: transformedData?.vaFileNumber || '',
      phone_number: transformedData.veteraPhoneNumber || '',
      email_address: transformedData.veteranEmailAddress || '',
    },
    // statement_of_truth_signature: transformedData.fullName,
    current_date: new Date().toJSON().slice(0, 10),
  };
  return JSON.stringify({
    ...dataPostTransform,
    form_number: formConfig.formId,
  });
}
