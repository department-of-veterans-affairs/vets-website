import {
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateHelpText } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        vaFileNumber: vaFileNumberSchema,
        serviceNumber: serviceNumberSchema,
      },
    },
  },
};

export const uiSchema = {
  spouseInformation: {
    ...titleUI('Your spouse’s military service information'),
    vaFileNumber: {
      ...vaFileNumberUI('Spouse’s VA file number'),
      'ui:description': generateHelpText(
        'Enter this number only if it’s different from their Social Security number',
      ),
      'ui:options': {
        width: 'md',
      },
    },
    serviceNumber: {
      ...serviceNumberUI('Spouse’s military service number'),
      'ui:description': generateHelpText(
        'Enter your spouse’s military service number if they have one',
      ),
      'ui:options': {
        width: 'md',
      },
    },
  },
};
