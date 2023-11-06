import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import fullNameUI from 'platform/forms/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import UnauthenticatedWarningAlert from '../containers/UnauthenticatedWarningAlert';

const {
  veteranFullName,
  veteranDateOfBirth,
  veteranSocialSecurityNumber,
  vaFileNumber,
} = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantDescription,
    'view:warningAlert': {
      'ui:description': UnauthenticatedWarningAlert,
      'ui:options': {
        hideIf: formData => formData.isLoggedIn,
      },
    },
    veteranFullName: fullNameUI,
    veteranSocialSecurityNumber: {
      ...ssnUI,
      'ui:title': 'Your Social Security number',
    },
    vaClaimsHistory: yesNoUI({
      title: 'Have you filed any type of VA claim before?',
      uswds: true,
    }),
    vaFileNumber: {
      'ui:title': 'VA file number',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'Enter your VA file number if it doesn’t match your SSN',
        hideIf: formData => formData.vaClaimsHistory !== true,
      },
      'ui:errorMessages': {
        pattern: 'Your VA file number must be 8 or 9 digits',
      },
    },
    veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
  },
  schema: {
    type: 'object',
    required: [
      'veteranFullName',
      'veteranSocialSecurityNumber',
      'veteranDateOfBirth',
    ],
    properties: {
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      veteranFullName,
      veteranSocialSecurityNumber,
      vaClaimsHistory: yesNoSchema,
      vaFileNumber,
      veteranDateOfBirth,
    },
  },
};
