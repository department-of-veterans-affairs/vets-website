import React from 'react';
import { newFormFields, RELATIONSHIP } from './constants';

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
 * @param {*} rawDate A date in the form '01-01-2000'
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

export const applicantIsChildOfSponsor = formData => {
  const numSelectedSponsors = formData[newFormFields.selectedSponsors]?.length;

  if (
    !numSelectedSponsors ||
    (numSelectedSponsors === 1 && formData.sponsors?.someoneNotListed)
    // ||
    // (numSelectedSponsors > 1 &&
    //   formData.firstSponsor === SPONSOR_NOT_LISTED_VALUE)
  ) {
    return (
      formData[newFormFields.newRelationshipToServiceMember] ===
      RELATIONSHIP.CHILD
    );
  }

  const sponsors = formData.sponsors?.sponsors;
  const sponsor =
    numSelectedSponsors === 1
      ? sponsors?.find(s => s.selected)
      : sponsors?.find(s => s.id === formData.firstSponsor);

  return sponsor?.relationship === RELATIONSHIP.CHILD;
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
