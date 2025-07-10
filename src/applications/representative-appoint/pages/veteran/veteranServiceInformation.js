import {
  radioSchema,
  radioUI,
  titleUI,
  titleSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { branchOptions } from '../../constants/options';

export const uiSchema = {
  ...titleUI('Your service information'),
  'Branch of Service': radioUI('Branch of service'),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    'Branch of Service': radioSchema(branchOptions),
  },
  required: ['Branch of Service'],
};
