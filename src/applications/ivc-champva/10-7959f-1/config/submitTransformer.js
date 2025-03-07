/* eslint-disable camelcase */
import CONSTANTS from 'vets-json-schema/dist/constants.json'; // For countries
import { formatDateShort } from 'platform/utilities/date';
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { concatStreets } from '../../shared/utilities';

// Take an address object and turn it into a string with line breaks
function stringifyAddress(addr) {
  return addr
    ? `${concatStreets(addr, true).streetCombined}${addr.city}, ${
        addr.state
      }\n${addr.postalCode}`
    : '';
}

/**
 * Converts country codes to full country names and returns updated address.
 * e.g., {country: 'USA'} => {country: 'United States'}
 * @param {object} addr Standard address object provided by the addressUI component.
 * @returns Updated address object with country value replaced or left alone depending on presence of matching country label in the CONSTANTS file.
 */
function getCountryLabel(addr) {
  const tmpAdr = addr;
  // Find country label that matches country code in `addr`
  tmpAdr.country =
    CONSTANTS.countries.filter(c => c.value === tmpAdr.country)[0]?.label ??
    tmpAdr.country; // leave untouched if no match found
  return tmpAdr;
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
      ssn: transformedData?.veteranSocialSecurityNumber?.ssn,
      vaClaimNumber: transformedData?.veteranSocialSecurityNumber?.vaFileNumber,
      phone_number: transformedData.veteranPhoneNumber || '',
      email_address: transformedData.veteranEmailAddress || '',
    },
    statementOfTruthSignature: transformedData.statementOfTruthSignature,
    current_date: formatDateShort(new Date()),
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

  // Replace country code with full name:
  dataPostTransform.veteran.physical_address = getCountryLabel(
    dataPostTransform.veteran.physical_address,
  );
  dataPostTransform.veteran.mailing_address = getCountryLabel(
    dataPostTransform.veteran.mailing_address,
  );

  return JSON.stringify({
    ...dataPostTransform,
    form_number: formConfig.formId,
  });
}
