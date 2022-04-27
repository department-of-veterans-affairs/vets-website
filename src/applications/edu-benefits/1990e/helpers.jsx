import React from 'react';

import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}

export const relationshipLabels = {
  spouse: 'Spouse',
  child: 'Child',
};

export function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

export function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function eligibilityDescription() {
  return (
    <div className="usa-alert usa-alert-warning usa-content edu-benefits-alert">
      <div className="usa-alert-body">
        <ul>
          <li>
            You may be eligible for more than 1 education benefit program.
          </li>
          <li>You can only get payments from 1 program at a time.</li>
          <li>
            You can’t get more than 48 months of benefits under any combination
            of VA education programs.
          </li>
          <li>
            If you are unsure of what benefit has been transferred to you,
            please contact your Sponsor.
          </li>
        </ul>
      </div>
    </div>
  );
}

export const benefitsLabels = {
  chapter33: <p>Post-9/11 GI Bill (Chapter 33)</p>,
  chapter30: <p>Montgomery GI Bill (MGIB-AD, Chapter 30)</p>,
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

export const hideUnder18Field = (formData, fieldName) => {
  if (!formData || !formData[fieldName]) {
    return true;
  }

  const dateParts = formData && formData[fieldName].split('-');

  if (!dateParts || dateParts.length !== 3) {
    return true;
  }
  const birthday = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const today18YearsAgo = new Date(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18)).setHours(
      0,
      0,
      0,
      0,
    ),
  );

  return (
    !isValidCurrentOrPastDate(dateParts[2], dateParts[1], dateParts[0]) ||
    birthday.getTime() <= today18YearsAgo.getTime()
  );
};
