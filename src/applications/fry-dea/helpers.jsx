import React from 'react';
import {
  formFields,
  RELATIONSHIP,
  VETERAN_NOT_LISTED_VALUE,
} from './constants';

export function isAlphaNumeric(str) {
  const alphaNumericRegEx = new RegExp(/^[a-z0-9]+$/i);
  return alphaNumericRegEx.test(str);
}

export function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

export function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export const addWhitespaceOnlyError = (field, errors, errorMessage) => {
  if (isOnlyWhitespace(field)) {
    errors.addError(errorMessage);
  }
};

/**
 * Formats a date in human-readable form. For example:
 * January 1, 2000.
 *
 * @param {*} rawDate A date in the form '2000-12-31' (December 31, 2000)
 * @returns A human-readable date string.
 */
export const formatReadableDate = rawDate => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let dateParts;
  let date;

  if (rawDate) {
    dateParts = rawDate.split('-');
    date = new Date(
      Number.parseInt(dateParts[0], 10),
      Number.parseInt(dateParts[1], 10) - 1,
      Number.parseInt(dateParts[2], 10),
    );
  }

  if (!date) {
    return '';
  }

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const applicantMatchesVeteranRelationship = (formData, relationship) => {
  const r =
    formData[formFields.selectedVeteran] === VETERAN_NOT_LISTED_VALUE
      ? formData[formFields.relationshipToVeteran]
      : formData.veterans?.find(
          v => v.id === formData[formFields.selectedVeteran],
        )?.relationship;

  return r === relationship;
};

export const applicantIsChildOfVeteran = formData => {
  return applicantMatchesVeteranRelationship(formData, RELATIONSHIP.CHILD);
};

export const applicantIsSpouseOfVeteran = formData => {
  return applicantMatchesVeteranRelationship(formData, RELATIONSHIP.SPOUSE);
};

export const bothFryAndDeaBenefitsAvailable = formData => {
  let hasDea = false;
  let hasFry = false;

  if (!formData?.veterans?.length) {
    return false;
  }

  for (const veteran of formData.veterans) {
    if (veteran.deaEligibility) {
      hasDea = true;
    }
    if (veteran.fryEligibility) {
      hasFry = true;
    }

    if (hasDea && hasFry) {
      break;
    }
  }

  return hasDea && hasFry;
};

export const AdditionalConsiderationTemplate = (
  title,
  path,
  formField,
  UI,
  SCHEMA,
) => {
  return {
    title,
    path,
    uiSchema: {
      'view:subHeadings': {
        'ui:description': <h3>{title}</h3>,
      },
      [formField]: { ...UI },
    },
    schema: {
      type: 'object',
      required: [formField],
      properties: {
        'view:subHeadings': {
          type: 'object',
          properties: {},
        },
        [formField]: { ...SCHEMA },
      },
    },
  };
};
