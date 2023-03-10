import { merge, pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import { validateMatch } from 'platform/forms-system/src/js/validation';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
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
    'minorHighSchoolQuestion',
    'highSchoolGedGradDate',
    'highSchoolGedExpectedGradDate',
    'guardianName',
    // 'guardianFirstName',
    // 'guardianLastName',
    'guardianAddress',
    'guardianMobilePhone',
    'guardianHomePhone',
    'guardianEmail',
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
    minorHighSchoolQuestion: {
      type: 'boolean',
    },
    highSchoolGedGradDate: {
      type: 'object',
      $ref: '#/definitions/date',
    },
    highSchoolGedExpectedGradDate: {
      type: 'object',
      $ref: '#/definitions/date',
    },
    guardianName: {
      type: 'object',
      properties: {
        'First name of Parent, Guardian or Custodian': {
          type: 'string',
        },
        'Middle name of Parent, Guardian or Custodian': {
          type: 'string',
        },
        'Last name of Parent, Guardian or Custodian': {
          type: 'string',
        },
      },
    },
    guardianAddress: addressSchema(schema),
    guardianMobilePhone: {
      type: 'object',
      $ref: '#/definitions/phone',
    },
    guardianHomePhone: {
      type: 'object',
      $ref: '#/definitions/phone',
    },
    guardianEmail: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        'view:confirmEmail': {
          type: 'string',
          format: 'email',
        },
      },
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
      minorHighSchoolQuestion: {
        'ui:title': 'Applicant has graduated high school or received GED?',
        'ui:widget': 'yesNo',
        'ui:options': {
          // hideIf: formData => eighteenOrOver(formData.relativeDateOfBirth),
        },
      },
      highSchoolGedGradDate: {
        ...currentOrPastDateUI('Date graduated'),
        'ui:options': {
          expandUnder: 'minorHighSchoolQuestion',
          // hideIf: formData => eighteenOrOver(formData.relativeDateOfBirth),
        },
      },
      highSchoolGedExpectedGradDate: {
        ...currentOrPastDateUI('Date expected to graduate'),
        'ui:options': {
          expandUnder: 'minorHighSchoolQuestion',
          expandUnderCondition: false,
          // hideIf: formData => eighteenOrOver(formData.relativeDateOfBirth),
        },
      },
      guardianName: {
        'ui:options': {
          // hideIf: formData => eighteenOrOver(formData.relativeDateOfBirth),
        },
      },
      guardianAddress: merge(
        {},
        addressUI('Address of Parent, Guardian or Custodian'),
        {
          'ui:options': {
            // hideIf: formData => eighteenOrOver(formData.relativeDateOfBirth),
          },
        },
      ),
      guardianMobilePhone: phoneUI('Mobile phone number'),
      guardianHomePhone: phoneUI('Home phone number'),
      guardianEmail: {
        'ui:validations': [
          validateMatch('email', 'view:confirmEmail', { ignoreCase: true }),
        ],
        email: emailUI(),
        'view:confirmEmail': merge({}, emailUI('Re-enter email address'), {
          'ui:options': {
            hideOnReview: true,
          },
        }),
      },
      gender: {
        'ui:widget': 'radio',
        'ui:title': 'Your Gender',
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
      ...personId.uiSchema(prefix, 'view:noSSN'),
    },
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
