import React from 'react';
import { merge, pick } from 'lodash';
import { validateMatch } from 'platform/forms-system/src/js/validation';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';

import { eighteenOrOver, SeventeenOrOlder } from '../helpers';

const defaults = () => ({
  fields: ['minorQuestions'],
  required: [],
  labels: {},
  isVeteran: false,
});

const guardianDescription = (
  <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
    <p>
      Parent, Guardian or Custodian information is required if applicant is
      under the age of 18.
    </p>
  </div>
);

/**
 * Returns a Guardian page based on the options passed.
 *
 * @param {Object} schema   The full schema for the form
 * @param {Object} options  Options to override the defaults above
 */
export default function GuardianInformation(schema, options) {
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
    depends: formData =>
      !eighteenOrOver(formData.veteranDateOfBirth) &&
      SeventeenOrOlder(formData.veteranDateOfBirth),
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
          'ui:title': 'First name of Parent, Guardian or Custodian',
          'ui:required': formData => {
            const isRequired = eighteenOrOver(formData.veteranDateOfBirth);
            return !isRequired;
          },
        },
        guardianMiddleName: {
          'ui:title': 'Middle name of Parent, Guardian or Custodian',
        },
        guardianLastName: {
          'ui:title': 'Last name of Parent, Guardian or Custodian',
          'ui:required': formData => {
            const isRequired = eighteenOrOver(formData.veteranDateOfBirth);
            return !isRequired;
          },
        },
        guardianAddress: merge(
          {},
          addressUI(
            'Address of Parent, Guardian or Custodian',
            false,
            formData => {
              const isRequired = eighteenOrOver(formData.veteranDateOfBirth);
              return !isRequired;
            },
          ),
        ),
        guardianMobilePhone: phoneUI('Mobile phone number'),
        guardianHomePhone: phoneUI('Home phone number'),
        guardianEmail: emailUI(),
        'view:confirmEmail': merge({}, emailUI('Re-enter email address'), {
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
