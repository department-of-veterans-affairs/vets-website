/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { concatStreets } from '../../shared/utilities';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  const dataPostTransform = {
    veteran: {
      date_of_birth: transformedData.veteranDateOfBirth,
      full_name: transformedData?.veteranFullName,
      physical_address: concatStreets(transformedData.physicalAddress) || {
        country: 'NA',
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
      },
      mailing_address: concatStreets(transformedData.veteranAddress) || {
        country: 'NA',
        street: 'NA',
        city: 'NA',
        state: 'NA',
        postalCode: 'NA',
      },
      ssn: transformedData?.veteranSocialSecurityNumber?.ssn || '',
      // file_number:
      //   transformedData?.veteranSocialSecurityNumber?.vaFileNumber || '',
      va_claim_number:
        transformedData?.veteranSocialSecurityNumber?.vaFileNumber || '',
      phone_number: transformedData.veteranPhoneNumber || '',
      email_address: transformedData.veteranEmailAddress || '',
    },
    statementOfTruthSignature: transformedData.statementOfTruthSignature,
    current_date: new Date().toJSON().slice(0, 10),
    primaryContactInfo: {
      name: {
        first: transformedData.veteranFullName?.first,
        last: transformedData.veteranFullName?.last,
      },
      email: transformedData.veteranEmailAddress,
      phone: transformedData.veteranPhoneNumber,
    },
  };

  return JSON.stringify({
    ...dataPostTransform,
    form_number: formConfig.formId,
  });
}
