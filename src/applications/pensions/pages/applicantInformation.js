import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
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
    veteranId: ssnOrVaFileNumberUI(),
    veteranDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranDateOfBirth'],
    properties: {
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      veteranFullName: fullNameSchema,
      veteranId: ssnOrVaFileNumberSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
