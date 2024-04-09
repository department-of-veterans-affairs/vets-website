/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );
  const dataPostTransform = {
    veteran: {
      date_of_birth: transformedData.veteranDOB || '',
      full_name: transformedData?.fullName || {},
      physical_address: transformedData.physicalAddress || {
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
        country: 'NA',
      },
      mailing_address: transformedData.mailingAddress || {
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
        country: 'NA',
      },
      ssn: transformedData?.ssn?.ssn || '',
      va_claim_number: transformedData?.vaFileNumber || '',
      phone_number: transformedData.phoneNumber || '',
      email_address: transformedData.emailAddress || '',
    },
    // statement_of_truth_signature: transformedData.fullName,
    current_date: new Date().toJSON().slice(0, 10),
  };
  return JSON.stringify({
    ...dataPostTransform,
    form_number: formConfig.formId,
  });
}
