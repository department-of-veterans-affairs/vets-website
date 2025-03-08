/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { formatDateShort } from 'platform/utilities/date';
import {
  concatStreets,
  getObjectsWithAttachmentId,
} from '../../shared/utilities';

// Take an address object and turn it into a string with line breaks
function stringifyAddress(addr) {
  return addr
    ? `${concatStreets(addr, true).streetCombined}${addr.city}, ${
        addr.state
      }\n${addr.postalCode}`
    : '';
}

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  const dataPostTransform = {
    veteran: {
      date_of_birth: formatDateShort(transformedData.veteranDateOfBirth),
      full_name: transformedData?.veteranFullName,
      physical_address: transformedData.sameMailingAddress
        ? transformedData.veteranAddress
        : transformedData.physical_address || {
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
      va_claim_number:
        transformedData?.veteranSocialSecurityNumber?.vaFileNumber || '',
      phone_number: transformedData.veteranPhoneNumber || '',
      email_address: transformedData.veteranEmailAddress || '',
      send_payment: transformedData.sendPayment,
    },
    statementOfTruthSignature: transformedData.statementOfTruthSignature,
    current_date: formatDateShort(new Date()),
    primaryContactInfo: {
      name: {
        first: transformedData.veteranFullName?.first,
        last: transformedData.veteranFullName?.last,
      },
      phone: transformedData.veteranPhoneNumber,
      email: transformedData.veteranEmailAddress,
    },
    supportingDocs: getObjectsWithAttachmentId(transformedData),
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
