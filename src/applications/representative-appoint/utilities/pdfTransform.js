import { getRepType } from './helpers';

function consentLimitsTransform(formData) {
  const medicalAuthorization = formData.inputAuthorizationsMedical;
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
    inputVeteranFullName,
    inputVeteranSSN: ssn,
    inputVeteranVAFileNumber,
    inputVeteranDOB: dateOfBirth,
    inputVeteranServiceNumber,
    inputVeteranHomeAddress: homeAddress,
    inputVeteranPrimaryPhone: phone,
    inputVeteranEmail: email,
    'view:selectedRepresentative': selectedRep,
    inputNonVeteranClaimantName,
    inputNonVeteranClaimantDOB,
    inputNonVeteranClaimantRelationship,
    inputVeteranServiceBranch: serviceBranch,
    inputNonVeteranClaimantHomeAddress: claimantAddress,
    inputAuthorizationsMedical,
    inputAuthorizationsAddressChange,
    inputAuthorizationsAccessInsideVASystems,
    inputAuthorizationsAccessOutsideVASystems,
    inputAuthorizationsTeamMembers,
    inputNonVeteranClaimantPhone,
    inputNonVeteranClaimantEmail,
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
      first: inputVeteranFullName?.first || '',
      middle: inputVeteranFullName?.middle || '',
      last: inputVeteranFullName?.last || '',
    },
    ssn,
    vaFileNumber: inputVeteranVAFileNumber,
    dateOfBirth,
    serviceNumber: inputVeteranServiceNumber,
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
            first: inputNonVeteranClaimantName?.first || '',
            middle: inputNonVeteranClaimantName?.middle || '',
            last: inputNonVeteranClaimantName?.last || '',
          },
          dateOfBirth: inputNonVeteranClaimantDOB || '',
          relationship: inputNonVeteranClaimantRelationship || '',
          address: createAddress(claimantAddress),
          phone: inputNonVeteranClaimantPhone || '',
          email: inputNonVeteranClaimantEmail || '',
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
    veteran,
    recordConsent: yesNoToBoolean(inputAuthorizationsMedical),
    consentAddressChange: yesNoToBoolean(inputAuthorizationsAddressChange),
    consentLimits: consentLimitsTransform(formData),
    consentInsideAccess: yesNoToBoolean(
      inputAuthorizationsAccessInsideVASystems,
    ),
    consentOutsideAccess: yesNoToBoolean(
      inputAuthorizationsAccessOutsideVASystems,
    ),
    consentTeamMembers: inputAuthorizationsTeamMembers
      ? inputAuthorizationsTeamMembers.split(',').map(item => item.trim())
      : null,
    representative,
    ...(formData['view:applicantIsVeteran'] === 'No' && { claimant }),
  };
}
