import { pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
import * as personId from 'platform/forms/definitions/personId';

import { relationshipLabels, genderLabels } from 'platform/static-data/labels';

import { ageWarning, eighteenOrOver } from '../helpers';

const defaults = prefix => ({
  fields: [
    `${prefix}FullName`,
    'view:noSSN',
    `${prefix}SocialSecurityNumber`,
    `${prefix}DateOfBirth`,
    'view:ageWarningNotification',
    'gender',
    'relationship',
  ],
  required: [`${prefix}FullName`, `${prefix}DateOfBirth`, 'relationship'],
  labels: {},
  isVeteran: false,
});

/**
 * Returns an applicantInformation page based on the options passed.
 *
 * @param {Object} schema   The full schema for the form
 * @param {Object} options  Options to override the defaults above
 */
export default function applicantInformationUpdate(schema, options) {
  // Use the defaults as necessary, but override with the options given
  const prefix = options && options.isVeteran ? 'veteran' : 'relative';
  const { fields, required, labels } = Object.assign(
    {},
    defaults(prefix),
    options,
  );

  const possibleProperties = Object.assign({}, schema.properties, {
    'view:noSSN': {
      type: 'boolean',
    },
    'view:ageWarningNotification': {
      type: 'object',
      properties: {},
    },
  });

  return {
    path: 'applicant/information',
    title: 'Applicant information',
    initialData: {},
    uiSchema: Object.assign(
      {},
      {
        'ui:order': fields,
        'ui:description': applicantDescription,
        [`${prefix}FullName`]: fullNameUI,
        [`${prefix}DateOfBirth`]: Object.assign(
          {},
          currentOrPastDateUI('Your date of birth'),
          {
            'ui:errorMessages': {
              pattern: 'Please provide a valid date',
              required: 'Please enter a date',
              futureDate: 'Please provide a valid date',
            },
          },
        ),
        'view:ageWarningNotification': {
          'ui:description': ageWarning,
          'ui:options': {
            hideIf: formData => eighteenOrOver(formData.relativeDateOfBirth),
          },
        },
        gender: {
          'ui:widget': 'radio',
          'ui:title': 'Gender',
          'ui:options': {
            labels: labels.gender || genderLabels,
          },
        },
        relationship: {
          'ui:widget': 'radio',
          'ui:title':
            'What’s your relationship to the service member whose benefit is being transferred to you?',
          'ui:options': {
            labels: labels.relationship || relationshipLabels,
          },
        },
      },
      personId.uiSchema(prefix, 'view:noSSN'),
    ),
    schema: {
      type: 'object',
      definitions: pick(schema.definitions, [
        'fullName',
        'relationship',
        'ssn',
        'gender',
        'date',
        'vaFileNumber',
      ]),
      required,
      properties: pick(possibleProperties, fields),
    },
  };
}
