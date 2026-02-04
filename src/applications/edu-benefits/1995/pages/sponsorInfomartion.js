import { pick } from 'lodash';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { sponsorInformationTitle } from '../helpers';

/**
 * Returns a Sponsor page based on the options passed.
 *
 * @param {Object} schema   The full schema for the form
 */
export const noSSNTitle = () => {
  return "I don't know my sponsor's Social Security number";
};

const showSponsorInfo = formData => {
  return (
    formData.benefitUpdate === 'chapter35' ||
    formData.benefitAppliedFor === 'chapter35'
  );
};

const defaults = () => ({
  fields: [
    'sponsorFullName',
    'sponsorSocialSecurityNumber',
    'view:noSSN',
    'vaFileNumber',
  ],
  required: ['sponsorFullName', 'sponsorSocialSecurityNumber'],
  labels: {},
  isVeteran: true,
});

export function sponsorInfo(schema) {
  const { fields, required } = {
    ...defaults(),
  };
  const possibleProperties = {
    ...schema.properties,
    'view:noSSN': {
      type: 'boolean',
    },
  };
  return {
    path: 'sponsor/information',
    title: sponsorInformationTitle(),
    depends: formData => showSponsorInfo(formData),
    uiSchema: {
      sponsorFullName: {
        first: {
          'ui:title': "Sponsor's first name",
          'ui:errorMessages': {
            required: 'Please enter a first name',
          },
        },
        middle: {
          'ui:title': "Sponsor's middle name",
        },
        last: {
          'ui:title': "Sponsor's last name",
          'ui:errorMessages': {
            required: 'Please enter a last name',
          },
        },
        suffix: {
          'ui:title': 'Suffix',
          'ui:options': {
            widgetClassNames: 'form-select-medium',
          },
        },
      },
      sponsorSocialSecurityNumber: {
        ...ssnUI,
        'ui:title': "Sponsor's Social Security number",
        'ui:required': formData => !formData['view:noSSN'],
      },
      'view:noSSN': {
        'ui:title': noSSNTitle(),
        'ui:options': {
          hideOnReview: true,
        },
      },
      vaFileNumber: {
        'ui:required': formData => formData['view:noSSN'],
        'ui:title': "Sponsor's VA file number",
        'ui:options': {
          expandUnder: 'view:noSSN',
        },
        'ui:errorMessages': {
          pattern: 'Your VA file number must be between 7 to 9 digits',
        },
      },
    },

    schema: {
      type: 'object',
      definitions: pick(schema.definitions, [
        'fullName',
        'ssn',
        'vaFileNumber',
      ]),
      required,
      properties: pick(possibleProperties, fields),
    },
  };
}
