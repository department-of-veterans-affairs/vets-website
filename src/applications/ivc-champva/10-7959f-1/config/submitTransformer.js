/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );
  const dataPostTransform = {
    veteran: {
      date_of_birth: transformedData.veteranDOB,
      full_name: transformedData?.veteranFullName,
      physical_address: transformedData.physicalAddress || {
        country: 'NA',
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
      },
      mailing_address: transformedData.veteranAddress || {
        country: 'NA',
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
      },
      ssn: transformedData?.veteranSocialSecurityNumber?.ssn || '',
      va_claim_number: transformedData?.vaFileNumber || '',
      phone_number: transformedData.veteraPhoneNumber || '',
      email_address: transformedData.veteranEmailAddress || '',
    },
    // statement_of_truth_signature: transformedData.fullName,
    current_date: new Date().toJSON().slice(0, 10),
    primaryContactInfo: {
      name: {
        first: transformedData.firstName,
        last: transformedData.lastName,
      },
      email: transformedData.email_address,
      phone: transformedData.phone_number,
    },
  };
  return JSON.stringify({
    ...dataPostTransform,
    form_number: formConfig.formId,
  });
}
