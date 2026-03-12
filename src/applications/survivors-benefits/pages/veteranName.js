import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameSchema,
  titleUI,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { UnauthenticatedWarningAlert } from '../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran’s name and date of birth'),
    'view:warningAlert': {
      'ui:description': UnauthenticatedWarningAlert,
    },
    veteranFullName: fullNameUI(),
    veteranDateOfBirth: dateOfBirthUI({
      monthSelect: false,
    }),
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
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
