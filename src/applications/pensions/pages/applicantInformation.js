import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import applicantDescription from '@department-of-veterans-affairs/platform-forms/ApplicantDescription';
import UnauthenticatedWarningAlert from '../containers/UnauthenticatedWarningAlert';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantDescription,
    'view:warningAlert': {
      'ui:description': UnauthenticatedWarningAlert,
    },
    veteranFullName: fullNameUI(),
    veteranSocialSecurityNumber: ssnUI(),
    vaClaimsHistory: yesNoUI({
      title: 'Have you ever filed a claim with VA?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    vaFileNumber: {
      ...vaFileNumberUI(),
      'ui:options': {
        hint: 'Enter your VA file number if it doesn’t match your SSN',
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
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      veteranFullName: fullNameSchema,
      veteranSocialSecurityNumber: ssnSchema,
      vaClaimsHistory: yesNoSchema,
      vaFileNumber: vaFileNumberSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
