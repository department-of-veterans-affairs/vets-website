import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import DateField from '../components/DateField';
import { lastDayOfMonth } from '../helpers';

const uiSchema = {
  ...titleUI('Active duty status release date'),
  dateReleasedFromActiveDuty: {
    'ui:title':
      'Please provide the date you were or will be released from active duty.',
    'ui:webComponentField': DateField,
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'You must provide an answer',
    },
    'ui:options': {
      monthSelect: false,
      hint: 'Enter 2 digits for the month and day and 4 digits for the year.',
      classNames: 'va-memorable-date-field',
      customYearErrorMessage: 'Please enter a valid date',
      customMonthErrorMessage: 'Please enter a valid date',
      customDayErrorMessage: 'Please enter a valid date',
    },
    'ui:validations': [
      // Validation built into VaMemorableDateField (underlying component of DateField) doesn't block forward navigation,
      // so adding custom validation here to ensure the date is valid before allowing the user to continue.
      (errors, field) => {
        const [year, month, day] = field.split('-').map(Number);
        const minYear = 1900;
        const maxYear = new Date().getFullYear() + 100;
        const maxDay = lastDayOfMonth(month, year);

        if (!month || month < 1 || month > 12) {
          errors.addError('Please enter a valid date');
        }

        if (!day || day < 1 || day > maxDay) {
          errors.addError('Please enter a valid date');
        }

        if (!year || year < minYear || year > maxYear) {
          errors.addError('Please enter a valid date');
        }
      },
    ],
  },
  'view:releaseDateNote': {
    'ui:description': (
      <p className="vads-u-margin-top--4" data-testid="static-note">
        <strong>Note:</strong> If you are a transitioning service member on
        terminal leave, we may ask you to provide your future-dated DD 214. If
        we’re otherwise unable to verify that your release from active duty is
        within 180 days from this application’s date, we may contact you for a
        certification of expected release date. You can request that document
        from your Military Personnel Office.
      </p>
    ),
  },
};

const schema = {
  type: 'object',
  properties: {
    dateReleasedFromActiveDuty: { type: 'string' },
    'view:releaseDateNote': { type: 'object', properties: {} },
  },
  required: ['dateReleasedFromActiveDuty'],
};

export default { schema, uiSchema };
