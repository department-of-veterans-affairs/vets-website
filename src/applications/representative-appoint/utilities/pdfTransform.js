import { getRepType } from './helpers';

function consentLimitsTransform(formData) {
  const medicalAuthorization = formData.authorizationRadio;
  let authorizeRecords;
  if (
    medicalAuthorization ===
      'Yes, they can access all of these types of records' ||
    medicalAuthorization ===
      "No, they can't access any of these types of records"
  ) {
    authorizeRecords = {};
  } else {
    authorizeRecords = formData.authorizeMedicalSelectCheckbox || {};
  }

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

function yesNoToBoolean(field) {
  if (typeof field !== 'string') {
    return null;
  }
  return !!field.trim().startsWith('Yes');
}

export function pdfTransform(formData) {
  const {
    veteranFullName,
    veteranSocialSecurityNumber: ssn,
    vaFileNumber,
    veteranDateOfBirth: dateOfBirth,
    serviceNumber,
    veteranHomeAddress: homeAddress,
    primaryPhone: phone,
    veteranEmail: email,
    'view:selectedRepresentative': selectedRep,
    applicantName,
    applicantDOB,
    claimantRelationship,
    'Branch of Service': serviceBranch,
    homeAddress: claimantAddress,
    authorizationRadio,
    authorizeAddressRadio,
    authorizeInsideVARadio,
    authorizeOutsideVARadio,
    authorizeNamesTextArea,
    applicantPhone,
    applicantEmail,
    representativeSubmissionMethod,
  } = formData;

  const createAddress = (address = {}) => ({
    addressLine1: address.street || '',
    addressLine2: address.street2 || '',
    city: address.city || '',
    stateCode: address.state || '',
    country: address.country || '',
    zipCode: address.postalCode || '',
    zipCodeSuffix: address.zipCodeSuffix || '',
  });

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
    serviceBranch: serviceBranch?.replace(/ /g, '_').toUpperCase() || null,
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

  const repType = getRepType(selectedRep);

  const representative = {};

  if (repType !== 'Organization') {
    representative.id = selectedRep?.id;
  }

  if (repType === 'Organization') {
    representative.organizationId = selectedRep?.id;
  } else if (repType === 'VSO Representative') {
    if (formData?.selectedAccreditedOrganizationId) {
      representative.organizationId = formData.selectedAccreditedOrganizationId;
    } else {
      representative.organizationId =
        selectedRep?.attributes?.accreditedOrganizations?.data[0]?.id || null;
    }
  }

  return {
    representativeSubmissionMethod,
    veteran,
    recordConsent: yesNoToBoolean(authorizationRadio),
    consentAddressChange: yesNoToBoolean(authorizeAddressRadio),
    consentLimits: consentLimitsTransform(formData),
    consentInsideAccess: yesNoToBoolean(authorizeInsideVARadio),
    consentOutsideAccess: yesNoToBoolean(authorizeOutsideVARadio),
    consentTeamMembers: authorizeNamesTextArea
      ? authorizeNamesTextArea.split(',').map(item => item.trim())
      : null,
    representative,
    ...(formData['view:applicantIsVeteran'] === 'No' && { claimant }),
  };
}
