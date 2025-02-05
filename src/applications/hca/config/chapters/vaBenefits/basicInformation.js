import { FULL_SCHEMA } from '../../../utils/imports';
import {
  CompensationInfoDescription,
  CompensationTypeDescription,
} from '../../../components/FormDescriptions';

const { vaCompensationType } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': 'Current compensation from VA',
    'ui:description': CompensationInfoDescription,
    vaCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationTypeDescription,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lowDisability:
            'Yes, for a service-connected disability rating of up to 40%',
          highDisability:
            'Yes, for a service-connected disability rating of 50% or higher',
          none: 'No',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['vaCompensationType'],
    properties: {
      vaCompensationType,
    },
  },
};
