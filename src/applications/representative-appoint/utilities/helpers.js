import React from 'react';
import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import moment from 'moment';
import { isEmpty } from 'lodash';
import formConfig from '../config/form';
import { DATE_FORMAT } from '../definitions/constants';

export const representativeTypeMap = {
  Attorney: 'attorney',
  'Claims Agent': 'claims agent',
  'Veterans Service Organization (VSO)': 'Veterans Service Organization (VSO)',
};

export const checkboxGroupSchemaWithReviewLabels = keys => {
  const schema = checkboxGroupSchema(keys);
  keys.forEach(key => {
    schema.properties[key] = {
      ...schema.properties[key],
      enum: [true, false],
      enumNames: ['Selected', 'Not selected'],
    };
  });
  return schema;
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

export const initializeFormDataWithClaimantInformationAndPrefill = (
  applicantIsVeteran,
  veteranPrefillStore,
) => {
  return {
    ...createInitialState(formConfig).data,
    'view:applicantIsVeteran': applicantIsVeteran,
    'view:veteranPrefillStore': veteranPrefillStore,
  };
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
  if (entityType === 'individual') {
    const { individualType } = entity.attributes;
    if (individualType === 'representative') {
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
  if (entityType === 'individual') {
    const { individualType } = entity.attributes;
    if (individualType === 'representative') {
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

  if (repType === 'claimsAgent' || repType === 'claims_agent') {
    return 'Claims Agent';
  }

  return 'VSO Representative';
};

export const getFormNumber = formData => {
  const entity = formData['view:selectedRepresentative'];
  const entityType = entity?.type;

  if (
    entityType === 'organization' ||
    (entityType === 'individual' &&
      entity.attributes.individualType === 'representative')
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

const isOrg = formData =>
  formData['view:selectedRepresentative']?.type === 'organization';

export const isAttorneyOrClaimsAgent = formData => {
  const repType =
    formData['view:selectedRepresentative']?.attributes?.individualType;

  return (
    repType === 'attorney' ||
    repType === 'claimsAgent' ||
    repType === 'claims_agent'
  );
};

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

export const convertRepType = input => {
  const mapping = {
    representative: 'VSO',
    attorney: 'Attorney',
    /* eslint-disable-next-line camelcase */
    claims_agent: 'Claims Agent',
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
