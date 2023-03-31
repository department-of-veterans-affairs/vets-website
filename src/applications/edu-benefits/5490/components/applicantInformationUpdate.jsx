import { pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
import * as personId from 'platform/forms/definitions/personId';

import { relationshipLabels, genderLabels } from 'platform/static-data/labels';

import environment from 'platform/utilities/environment';

import {
  ageWarning,
  eighteenOrOver,
  relationshipAndChildTypeLabels,
} from '../helpers';

const defaults = prefix => ({
  fields: [
    `${prefix}FullName`,
    'view:noSSN',
    `${prefix}SocialSecurityNumber`,
    `${prefix}DateOfBirth`,
    'view:ageWarningNotification',
    'gender',
    'relationship',
    'relationshipAndChildType',
  ],
  required: [`${prefix}FullName`, `${prefix}DateOfBirth`],
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
  const { fields, required, labels } = {
    ...defaults(prefix),
    ...options,
  };

  const possibleProperties = {
    ...schema.properties,
    'view:noSSN': {
      type: 'boolean',
    },
    'view:ageWarningNotification': {
      type: 'object',
      properties: {},
    },
  };

  return {
    path: 'applicant/information',
    title: 'Applicant information',
    initialData: {},
    uiSchema: {
      'ui:order': fields,
      'ui:description': applicantDescription,
      [`${prefix}FullName`]: fullNameUI,
      [`${prefix}DateOfBirth`]: {
        ...currentOrPastDateUI('Your date of birth'),
        'ui:errorMessages': {
          pattern: 'Please provide a valid date',
          required: 'Please enter a date',
          futureDate: 'Please provide a valid date',
        },
      },
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
          hideIf: () => !environment.isProduction(),
        },
        'ui:required': () => environment.isProduction(),
      },
      relationshipAndChildType: {
        'ui:widget': 'radio',
        'ui:title':
          'What’s your relationship to the service member whose benefit is being transferred to you?',
        'ui:options': {
          labels: relationshipAndChildTypeLabels,
          hideIf: () => environment.isProduction(),
        },
        'ui:required': () => !environment.isProduction(),
      },
      ...personId.uiSchema(prefix, 'view:noSSN'),
    },
    schema: {
      type: 'object',
      definitions: pick(schema.definitions, [
        'fullName',
        'relationship',
        'relationshipAndChildType',
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
