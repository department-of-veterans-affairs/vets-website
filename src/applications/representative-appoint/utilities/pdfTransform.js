import { isAttorneyOrClaimsAgent } from './helpers';

function consentLimitsTransform(formData) {
  const authorizeRecords = formData['view:authorizeRecordsCheckbox'] || {};

  const conditionsMap = {
    alcoholRecords: 'ALCOHOLISM',
    drugAbuseRecords: 'DRUG_ABUSE',
    HIVRecords: 'HIV',
    sickleCellRecords: 'SICKLE_CELL',
  };

  return Object.entries(conditionsMap)
    .filter(([key]) => authorizeRecords[key])
    .map(([, value]) => value);
}

export function pdfTransform(formData) {
  const {
    veteranFullName,
    veteranSocialSecurityNumber: ssn,
    vaFileNumber,
    veteranDateOfBirth: dateOfBirth,
    serviceNumber,
    veteranHomeAddress: homeAddress,
    'Primary phone': phone,
    veteranEmail: email,
    'view:selectedRepresentative': selectedRep,
    applicantName,
    applicantDOB,
    claimantRelationship,
    homeAddress: claimantAddress,
    authorizationRadio,
    authorizeAddressRadio,
    applicantPhone,
    applicantEmail,
  } = formData;

  // extracts address information
  const createAddress = (address = {}) => ({
    addressLine1: address.street || '',
    addressLine2: address.street2 || '',
    city: address.city || '',
    stateCode: address.state || '',
    country: address.country || '',
    zipCode: address.postalCode || '',
    zipCodeSuffix: address.zipCodeSuffix || '',
  });

  // construct veteran object
  const veteran = {
    name: {
      first: veteranFullName?.first || '',
      middle: veteranFullName?.middle || '',
      last: veteranFullName?.last || '',
    },
    ssn,
    vaFileNumber,
    dateOfBirth,
    serviceNumber,
    insuranceNumbers: [],
    address: createAddress(homeAddress),
    phone,
    email,
  };

  // construct claimant object (or reuse veteran)
  const claimant =
    formData['view:applicantIsVeteran'] === 'Yes'
      ? null
      : {
          name: {
            first: applicantName?.first || '',
            middle: applicantName?.middle || '',
            last: applicantName?.last || '',
          },
          dateOfBirth: applicantDOB || '',
          relationship: claimantRelationship || '',
          address: createAddress(claimantAddress),
          phone: applicantPhone || '',
          email: applicantEmail || '',
        };

  // transform representative data
  const repAttributes = selectedRep?.attributes || {};

  const representative = isAttorneyOrClaimsAgent(formData)
    ? {
        name: {
          first: repAttributes.firstName || '',
          middle: repAttributes.middleName || '',
          last: repAttributes.lastName || '',
        },
        type: repAttributes.individualType || '',
        address: createAddress(repAttributes),
        phone: repAttributes.phone || '',
        email: repAttributes.email || '',
      }
    : { organizationName: formData.selectedAccreditedOrganizationId || '' };

  return {
    veteran,
    recordConsent: authorizationRadio || '',
    consentAddressChange: authorizeAddressRadio || '',
    consentLimits: consentLimitsTransform(formData),
    representative,
    ...(formData['view:applicantIsVeteran'] === 'No' && { claimant }),
  };
}
