import React from 'react';
import { merge, pick } from 'lodash';
import { validateMatch } from 'platform/forms-system/src/js/validation';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import { isEighteenOrOlder } from '../helpers';

const defaults = () => ({
  fields: ['minorQuestions'],
  required: [],
  labels: {},
  isVeteran: false,
});

const isEighteenOrYounger = formData => {
  return !isEighteenOrOlder(formData.dateOfBirth);
};

const guardianDescription = (
  <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
    <p>Name of parent, guardian or custodian</p>
  </div>
);

/**
 * Returns a Guardian page based on the options passed.
 *
 * @param {Object} schema   The full schema for the form
 * @param {Object} options  Options to override the defaults above
 */
export default function guardianInformation(schema, options) {
  // Use the defaults as necessary, but override with the options given
  const { fields, required } = {
    ...defaults(),
    ...options,
  };

  const possibleProperties = {
    ...schema.properties,
    minorQuestions: {
      type: 'object',
      properties: {
        guardianFirstName: {
          type: 'string',
        },
        guardianMiddleName: {
          type: 'string',
        },
        guardianLastName: {
          type: 'string',
        },
        guardianSuffix: {
          type: 'string',
          enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
        },
        guardianAddress: addressSchema(schema),
        guardianMobilePhone: {
          type: 'object',
          $ref: '#/definitions/usaPhone',
        },
        guardianHomePhone: {
          type: 'object',
          $ref: '#/definitions/usaPhone',
        },
        guardianEmail: {
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
    path: 'personal-information/guardian-contact',
    title: 'Guardian Contact',
    initialData: {},
    depends: formData => {
      return isEighteenOrYounger(formData);
    },
    uiSchema: {
      'ui:order': fields,
      'ui:description': guardianDescription,
      minorQuestions: {
        'ui:validations': [
          validateMatch('guardianEmail', 'view:confirmEmail', {
            ignoreCase: true,
          }),
        ],
        guardianFirstName: {
          'ui:title': 'First name',
          'ui:required': formData => {
            return isEighteenOrYounger(formData);
          },
        },
        guardianMiddleName: {
          'ui:title': 'Middle name',
        },
        guardianLastName: {
          'ui:title': 'Last name',
          'ui:required': formData => {
            return isEighteenOrYounger(formData);
          },
        },
        guardianSuffix: {
          'ui:title': 'Suffix',
        },
        guardianAddress: merge(
          {},
          addressUI(
            'Contact information for parent, guardian or custodian',
            false,
            formData => {
              return isEighteenOrYounger(formData);
            },
          ),
        ),
        guardianMobilePhone: phoneUI('Mobile'),
        guardianHomePhone: phoneUI('Home'),
        guardianEmail: {
          ...emailUI(),
          'ui:title': 'Email address of parent, guardian or custodian',
          'ui:required': formData => {
            return isEighteenOrYounger(formData);
          },
        },
        'view:confirmEmail': merge({}, emailUI('Re-enter email address'), {
          'ui:required': formData => {
            return isEighteenOrYounger(formData);
          },
          'ui:options': {
            hideOnReview: true,
          },
        }),
      },
    },
    schema: {
      type: 'object',
      definitions: pick(schema.definitions, ['date']),
      required,
      properties: pick(possibleProperties, fields),
    },
  };
}
