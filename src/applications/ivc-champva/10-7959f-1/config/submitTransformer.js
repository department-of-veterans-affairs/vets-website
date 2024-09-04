/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

// Take an address object and turn it into a string with line breaks
function stringifyAddress(addr) {
  return addr
    ? `${addr.street}\n${addr.street2 ?? ''}\n${addr.street3 ?? ''}\n${
        addr.city
      }, ${addr.state}\n${addr.postalCode}`
    : '';
}

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  const dataPostTransform = {
    veteran: {
      date_of_birth: transformedData.veteranDateOfBirth,
      full_name: transformedData?.veteranFullName,
      physical_address: transformedData.sameMailingAddress
        ? transformedData.veteranAddress
        : transformedData.physicalAddress || {
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

  // Stringify and format the addresses so they fit in the PDF fields properly
  dataPostTransform.veteran.physicalAddressString = stringifyAddress(
    dataPostTransform.veteran.physical_address,
  );
  dataPostTransform.veteran.mailingAddressString = stringifyAddress(
    dataPostTransform.veteran.mailing_address,
  );

  return JSON.stringify({
    ...dataPostTransform,
    form_number: formConfig.formId,
  });
}
