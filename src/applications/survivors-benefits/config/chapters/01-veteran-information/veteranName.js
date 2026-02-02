import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameSchema,
  titleUI,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { UnauthenticatedWarningAlert } from '../../../components/FormAlerts';
import { setDefaultIsOver65 } from './helpers';

const updatedFullNameSchema = fullNameSchema;
updatedFullNameSchema.properties.first.maxLength = 12;
updatedFullNameSchema.properties.last.maxLength = 18;

/** @type {PageSchema} */
export default {
  updateFormData: setDefaultIsOver65,
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
      veteranFullName: updatedFullNameSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
