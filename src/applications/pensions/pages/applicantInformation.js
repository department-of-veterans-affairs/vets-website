import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
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
