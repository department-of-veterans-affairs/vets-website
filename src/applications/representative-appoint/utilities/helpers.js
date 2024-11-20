import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { DATE_FORMAT } from '../definitions/constants';

export const representativeTypeMap = {
  Attorney: 'attorney',
  'Claims Agent': 'claims agent',
  'Veterans Service Organization (VSO)': 'Veterans Service Organization (VSO)',
};

export const deviewifyFields = formData => {
  const newFormData = {};
  Object.keys(formData).forEach(key => {
    const nonViewKey = /^view:/.test(key) ? key.replace('view:', '') : key;
    // Recurse if necessary
    newFormData[nonViewKey] =
      typeof formData[key] === 'object' && !Array.isArray(formData[key])
        ? deviewifyFields(formData[key])
        : formData[key];
  });
  return newFormData;
};

export const preparerIsVeteran = ({ formData } = {}) =>
  formData?.['view:applicantIsVeteran'] === 'Yes';

export const isLoggedIn = ({ formData } = {}) => {
  if (formData) {
    return formData['view:isLoggedIn'];
  }
  return false;
};

export const hasVeteranPrefill = ({ formData } = {}) => {
  return (
    !isEmpty(formData?.['view:veteranPrefillStore']?.fullName) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.dateOfBirth) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.veteranSsnLastFour) &&
    !isEmpty(
      formData?.['view:veteranPrefillStore']?.veteranVaFileNumberLastFour,
    )
  );
};

export const preparerIsVeteranAndHasPrefill = ({ formData }) => {
  if (environment.isLocalhost()) {
    return true;
  }
  return preparerIsVeteran({ formData }) && hasVeteranPrefill({ formData });
};

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

/**
 * Setting submit url suffix based on rep type
 */
export const getFormSubmitUrlSuffix = formData => {
  const entity = formData['view:selectedRepresentative'];
  const entityType = entity?.type;

  if (entityType === 'organization') {
    return '2122';
  }
  if (['representative', 'individual'].includes(entityType)) {
    const { individualType } = entity.attributes;
    if (
      ['representative', 'veteran_service_officer'].includes(individualType)
    ) {
      return '2122';
    }
    return '2122a';
  }
  return '2122';
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

  const repType = entity.attributes?.individualType;

  if (repType === 'attorney') {
    return 'Attorney';
  }

  if (['claimsAgent', 'claims_agent', 'claim_agents'].includes(repType)) {
    return 'Claims Agent';
  }

  return 'VSO Representative';
};

export const getFormNumber = formData => {
  const entity = formData['view:selectedRepresentative'];
  const entityType = entity?.type;

  if (
    entityType === 'organization' ||
    (['representative', 'individual'].includes(entityType) &&
      ['representative', 'veteran_service_officer'].includes(
        entity.attributes.individualType,
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

export const isVSORepresentative = formData => {
  const rep = formData['view:selectedRepresentative'];

  if (rep.attributes?.accreditedOrganizations?.data?.length > 0) {
    return true;
  }
  return false;
};

export const isAttorneyOrClaimsAgent = formData => {
  const repType =
    formData['view:selectedRepresentative']?.attributes?.individualType;

  return ['attorney', 'claimsAgent', 'claims_agent', 'claim_agents'].includes(
    repType,
  );
};

const isOrg = formData =>
  formData['view:selectedRepresentative']?.type === 'organization';

export const getOrgName = formData => {
  if (isOrg(formData)) {
    return formData['view:selectedRepresentative']?.attributes?.name;
  }

  if (isAttorneyOrClaimsAgent(formData)) {
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

// Rep name used in Terms and Conditions agreement
export const getRepresentativeName = formData => {
  const rep = formData['view:selectedRepresentative'];

  if (!rep) {
    return null;
  }

  if (isOrg(formData)) {
    return formData['view:selectedRepresentative']?.attributes?.name;
  }
  return isVSORepresentative(formData)
    ? formData.selectedAccreditedOrganizationName
    : rep.attributes.fullName;
};

export const getApplicantName = formData => {
  const applicantIsVeteran = formData['view:applicantIsVeteran'] === 'Yes';

  const applicantFullName = applicantIsVeteran
    ? formData.veteranFullName
    : formData.applicantName;

  return `${applicantFullName.first} ${applicantFullName.middle} ${
    applicantFullName.last
  } ${applicantFullName.suffix}`;
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
