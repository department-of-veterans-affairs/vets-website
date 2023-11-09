import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import applicantDescription from 'platform/forms/components/ApplicantDescription';

const { vaFileNumber } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantDescription,
    veteranFullName: fullNameUI(),
    veteranSocialSecurityNumber: ssnUI(),
    vaClaimsHistory: yesNoUI({
      title: 'Have you filed any type of VA claim before?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    vaFileNumber: {
      'ui:title': 'VA file number',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
        hint: 'Enter your VA file number if it doesn’t match your SSN',
        hideIf: formData => formData.vaClaimsHistory !== true,
      },
      'ui:errorMessages': {
        pattern: 'Your VA file number must be 8 or 9 digits',
      },
    },
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: [
      'veteranFullName',
      'veteranSocialSecurityNumber',
      'veteranDateOfBirth',
    ],
    properties: {
      veteranFullName: fullNameSchema,
      veteranSocialSecurityNumber: ssnSchema,
      vaClaimsHistory: yesNoSchema,
      vaFileNumber,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
