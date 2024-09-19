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

export const preparerIsVeteran = ({ formData } = {}) => {
  if (formData) {
    return formData['view:applicantIsVeteran'] === 'Yes';
  }
  return false;
};

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
 * @typedef {Object} ParsedPhoneNumber
 * @property {string} contact - the "raw" phone number, used to populate the tel: link
 * @property {string} extension - the extension, can be any number of digits
 */

/**
 * Parses a phone number string for use with the Telephone component.
 * @param phone {String} "raw" phone number. The first 10 digits are treated as the "main" number.
 * Any remaining digits are treated as the extension.
 * Non-digits preceding the extension are ignored.
 * @returns {ParsedPhoneNumber}
 */

export const parsePhoneNumber = phone => {
  if (!phone) {
    return { contact: null, extension: null };
  }
  let sanitizedNumber = phone
    .replace(/[()\s]/g, '') // remove parentheses
    .replace(/(?<=.)([+.*])/g, '-'); // replace .*+ symbols being used as dashes

  // return null for non-US country codes
  if (sanitizedNumber.match(/\+(\d+)[^\d1]/g)) {
    return { contact: null, extension: null };
  }

  // remove US country codes +1 or 1
  sanitizedNumber = sanitizedNumber.replace(/^(\+1|1)\s*/, '');

  // capture first 10 digits + ext if applicable
  const parserRegex = /^(\d{10})(\D*?(\d+))?/;
  const contact = sanitizedNumber.replace(/-/g, '').replace(parserRegex, '$1');
  const extension =
    sanitizedNumber
      .replace(/-/g, '')
      .replace(parserRegex, '$3')
      .replace(/\D/g, '') || null;

  const isValidContactNumberRegex = /^(?:[2-9]\d{2})[2-9]\d{2}\d{4}$/;

  if (isValidContactNumberRegex.test(contact)) {
    return { contact, extension };
  }
  return { contact: null, extension: null };
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
