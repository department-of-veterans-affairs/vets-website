import React from 'react';
import moment from 'moment';
import { DATE_FORMAT } from '../definitions/constants';

export const representativeTypeMap = {
  Attorney: 'attorney',
  'Claims Agent': 'claims agent',
  'Veterans Service Organization (VSO)': 'Veterans Service Organization (VSO)',
};

export const preparerIsVeteran = ({ formData } = {}) =>
  formData?.['view:applicantIsVeteran'] === 'Yes';

/**
 * Show one thing, have a screen reader say another.
 *
 * @param {ReactElement|ReactComponent|String} srIgnored -- Thing to be displayed visually,
 *                                                           but ignored by screen readers
 * @param {String} substitutionText -- Text for screen readers to say instead of srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => (
  <span>
    <span aria-hidden>{srIgnored}</span>
    <span className="sr-only">{substitutionText}</span>
  </span>
);

export const formatDate = (date, format = DATE_FORMAT) => {
  const m = moment(date);
  return date && m.isValid() ? m.format(format) : 'Unknown';
};

/**
 * Setting subtitle based on rep type
 */
export const getFormSubtitle = formData => {
  const entity = formData['view:selectedRepresentative'];
  const entityType = entity?.type;

  if (entityType === 'organization') {
    return 'VA Form 21-22';
  }
  if (['representative', 'individual'].includes(entityType)) {
    const { individualType } = entity.attributes;
    if (
      ['representative', 'veteran_service_officer'].includes(individualType)
    ) {
      return 'VA Form 21-22';
    }
    return 'VA Form 21-22a';
  }
  return 'VA Forms 21-22 and 21-22a';
};

export const parseRepType = repType => {
  const parsedRep = {};

  switch (repType) {
    case 'Organization':
      parsedRep.title = 'Veterans Service Organization (VSO)';
      parsedRep.subTitle = 'Veteran Service Organization';
      break;
    case 'Attorney':
      parsedRep.title = 'accredited attorney';
      parsedRep.subTitle = 'Accredited attorney';
      break;
    case 'Claims Agent':
      parsedRep.title = 'accredited claims agent';
      parsedRep.subTitle = 'Accredited claims agent';
      break;
    default:
      parsedRep.title = 'accredited representative';
      parsedRep.subTitle = 'Accredited representative';
  }

  return parsedRep;
};

export const getEntityAddressAsObject = addressData => ({
  addressLine1: (addressData?.addressLine1 || '').trim(),
  addressLine2: (addressData?.addressLine2 || '').trim(),
  addressLine3: (addressData?.addressLine3 || '').trim(),
  city: (addressData?.city || '').trim(),
  stateCode: (addressData?.stateCode || '').trim(),
  zipCode: (addressData?.zipCode || '').trim(),
});

export const getEntityAddressAsString = addressData =>
  [
    (addressData.addressLine1 || '').trim(),
    (addressData.addressLine2 || '').trim(),
    (addressData.addressLine3 || '').trim(),
  ]
    .filter(Boolean)
    .join(' ') +
  (addressData.city ? ` ${addressData.city},` : '') +
  (addressData.stateCode ? ` ${addressData.stateCode}` : '') +
  (addressData.zipCode ? ` ${addressData.zipCode}` : '');

export const getRepType = entity => {
  if (entity?.type === 'organization') {
    return 'Organization';
  }

  const repType = entity?.attributes?.individualType;

  if (repType === 'attorney') {
    return 'Attorney';
  }

  if (['claimsAgent', 'claims_agent', 'claim_agents'].includes(repType)) {
    return 'Claims Agent';
  }

  return 'VSO Representative';
};

export const getFormNumberFromEntity = entity => {
  const repType = getRepType(entity);

  return ['Organization', 'VSO Representative'].includes(repType)
    ? '21-22'
    : '21-22a';
};

export const getFormNumber = formData => {
  const entity = formData['view:selectedRepresentative'];
  const entityType = entity?.type;

  if (
    entityType === 'organization' ||
    (['representative', 'individual'].includes(entityType) &&
      ['representative', 'veteran_service_officer'].includes(
        entity?.attributes?.individualType,
      ))
  ) {
    return '21-22';
  }

  return '21-22a';
};

export const getFormName = formData => {
  if (getFormNumber(formData) === '21-22') {
    return "Appointment of Veterans Service Organization as Claimant's Representative";
  }

  return "Appointment of Individual As Claimant's Representative";
};

/**
 * Takes representative object (rather than formData object)
 */
export const isVSORepresentative = rep => {
  if (rep?.attributes?.accreditedOrganizations?.data?.length > 0) {
    return true;
  }

  return false;
};

/**
 * If the representative is a claims agent or attorney, user will fill out 21-22A
 */
export const formIs2122A = formData =>
  ['attorney', 'claimsAgent', 'claims_agent', 'claim_agents'].includes(
    formData?.['view:selectedRepresentative']?.attributes?.individualType,
  ) || null;

const isOrg = formData =>
  formData['view:selectedRepresentative']?.type === 'organization';

export const getOrgName = formData => {
  if (isOrg(formData)) {
    return formData['view:selectedRepresentative']?.attributes?.name;
  }

  if (formIs2122A(formData)) {
    return null;
  }

  const orgs =
    formData['view:selectedRepresentative']?.attributes?.accreditedOrganizations
      ?.data;

  if (orgs && orgs.length > 1) {
    const id = formData?.selectedAccreditedOrganizationId;
    const selectedOrg = orgs.find(org => org.id === id);
    return selectedOrg?.attributes?.name;
  }

  return orgs[0]?.attributes?.name;
};

/**
 * Takes representative object (rather than formData object)
 */
export const formIs2122 = rep => {
  const repType = rep?.type;

  if (
    repType === 'organization' ||
    (['representative', 'individual'].includes(repType) &&
      ['representative', 'veteran_service_officer'].includes(
        rep?.attributes?.individualType,
      ))
  ) {
    return true;
  }

  return false;
};

// Rep name used in Terms and Conditions agreement
export const getRepresentativeName = formData => {
  const rep = formData['view:selectedRepresentative'];

  if (!rep) {
    return null;
  }

  if (isOrg(formData)) {
    return formData['view:selectedRepresentative']?.attributes?.name;
  }

  return isVSORepresentative(formData['view:selectedRepresentative'])
    ? formData.selectedAccreditedOrganizationName
    : rep.attributes.fullName;
};

export const getApplicantName = formData => {
  const applicantIsVeteran = formData['view:applicantIsVeteran'] === 'Yes';
  const applicantFullName = applicantIsVeteran
    ? formData.veteranFullName
    : formData.applicantName;

  return [
    applicantFullName.first,
    applicantFullName.middle,
    applicantFullName.last,
    applicantFullName.suffix,
  ]
    .filter(nameSection => nameSection && nameSection.trim())
    .join(' ');
};

export const convertRepType = input => {
  const mapping = {
    representative: 'VSO',
    attorney: 'Attorney',
    /* eslint-disable-next-line camelcase */
    claims_agent: 'Claims Agent',
    /* eslint-disable-next-line camelcase */
    claim_agents: 'Claims Agent',
    /* eslint-disable-next-line camelcase */
    veteran_service_officer: 'VSO',
    /* eslint-disable-next-line camelcase */
    organization: 'Organization',
  };

  return mapping[input] || input;
};

export const addressExists = address =>
  !!(
    address?.addressLine1?.trim() &&
    address?.city?.trim() &&
    address?.stateCode?.trim() &&
    address?.zipCode?.trim()
  );

export const userIsDigitalSubmitEligible = formData => {
  return (
    preparerIsVeteran({ formData }) && // only Veteran users are eligible at this time
    formData?.identityValidation?.hasIcn &&
    formData?.identityValidation?.hasParticipantId &&
    formData?.['view:v2IsEnabled']
  );
};

export const entityAcceptsDigitalPoaRequests = entity => {
  const repType = getRepType(entity);

  if (repType === 'Organization') {
    return !!entity?.attributes?.canAcceptDigitalPoaRequests;
  }
  if (repType === 'VSO Representative') {
    const accreditedOrganizations = entity?.attributes?.accreditedOrganizations;

    if (
      !accreditedOrganizations ||
      accreditedOrganizations?.data?.length === 0
    ) {
      return false;
    }

    return accreditedOrganizations.data.some(
      org => org?.attributes?.canAcceptDigitalPoaRequests === true,
    );
  }
  return false;
};

export const filterOrganizations = formData => {
  const organizations =
    formData['view:selectedRepresentative']?.attributes?.accreditedOrganizations
      ?.data;
  const submissionMethod = formData.representativeSubmissionMethod;

  if (submissionMethod === 'digital') {
    return organizations?.filter(
      org => org.attributes?.canAcceptDigitalPoaRequests === true,
    );
  }

  return organizations;
};
