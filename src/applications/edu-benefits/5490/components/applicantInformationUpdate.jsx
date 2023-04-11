import { pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';
import fullNameUI from 'platform/forms/definitions/fullName';
import * as personId from 'platform/forms/definitions/personId';

import { relationshipLabels, genderLabels } from 'platform/static-data/labels';

import environment from 'platform/utilities/environment';

import {
  ageWarning,
  eighteenOrOver,
  relationshipAndChildTypeLabels,
} from '../helpers';

const isNotProd = !environment.isProduction();

const conditionalFields = prefix => {
  return isNotProd
    ? [
        `${prefix}FullName`,
        'view:noSSN',
        `${prefix}SocialSecurityNumber`,
        `${prefix}DateOfBirth`,
        'view:ageWarningNotification',
        'minorHighSchoolQuestions',
        'gender',
        'relationshipAndChildType',
      ]
    : [
        `${prefix}FullName`,
        'view:noSSN',
        `${prefix}SocialSecurityNumber`,
        `${prefix}DateOfBirth`,
        'view:ageWarningNotification',
        'gender',
        'relationship',
      ];
};

const defaults = prefix => ({
  fields: conditionalFields(prefix),
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
    minorHighSchoolQuestions: {
      type: 'object',
      properties: {
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
          hideIf: formData => {
            return eighteenOrOver(formData.relativeDateOfBirth);
          },
        },
      },
      minorHighSchoolQuestions: {
        'ui:options': {
          expandUnder: 'view:ageWarningNotification',
          hideIf: formData => {
            let shouldNotShow = true;
            const overEighteen = eighteenOrOver(formData.relativeDateOfBirth);
            if (!isNotProd && !overEighteen) {
              shouldNotShow = true;
            } else {
              shouldNotShow = false;
            }
            return shouldNotShow;
          },
        },
        minorHighSchoolQuestion: {
          'ui:title': 'Applicant has graduated high school or received GED?',
          'ui:widget': 'yesNo',
          'ui:required': formData => {
            const isNotRequired = eighteenOrOver(formData.relativeDateOfBirth);
            if (isNotRequired && !isNotProd) {
              return isNotRequired;
            }
            return !isNotRequired;
          },
        },
        highSchoolGedGradDate: {
          ...currentOrPastDateUI('Date graduated'),
          'ui:options': {
            expandUnder: 'minorHighSchoolQuestion',
          },
          'ui:required': formData => {
            let isRequired = false;
            if (!eighteenOrOver(formData.relativeDateOfBirth)) {
              const yesNoResults =
                formData.minorHighSchoolQuestions.minorHighSchoolQuestion;
              if (yesNoResults) {
                isRequired = true;
              }
              if (!yesNoResults) {
                isRequired = false;
              }
            }
            return isRequired;
          },
        },
        highSchoolGedExpectedGradDate: {
          'ui:title': 'Date expected to graduate',
          'ui:widget': 'date',
          'ui:options': {
            expandUnder: 'minorHighSchoolQuestion',
            expandUnderCondition: false,
          },
          'ui:validations': [validateCurrentOrFutureDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or future date',
            required: 'Please enter a date',
          },
        },
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
      definitions: pick(
        schema.definitions,
        isNotProd
          ? [
              'fullName',
              'relationshipAndChildType',
              'ssn',
              'gender',
              'date',
              'vaFileNumber',
            ]
          : [
              'fullName',
              'relationship',
              'ssn',
              'gender',
              'date',
              'vaFileNumber',
            ],
      ),
      required,
      properties: pick(possibleProperties, fields),
    },
  };
}
