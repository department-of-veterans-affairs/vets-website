import { genericSchemas } from '../../../generic-schema';
import { suffixes } from '../../../constants';
import { StepchildInfo } from './helpers';
import { isChapterFieldRequired } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    stepChildren: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          first: genericSchemas.genericTextInput,
          middle: genericSchemas.genericTextInput,
          last: genericSchemas.genericTextInput,
          suffix: {
            type: 'string',
            enum: suffixes,
          },
        },
      },
    },
  },
};

export const uiSchema = {
  stepChildren: {
    'ui:options': {
      itemName: 'Stepchild',
      viewField: StepchildInfo,
    },
    items: {
      first: {
        'ui:title': 'Stepchild’s first name',
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
      },
      middle: {
        'ui:title': 'Stepchild’s middle name',
      },
      last: {
        'ui:title': 'Stepchild’s last name',
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
      },
      suffix: {
        'ui:title': 'Stepchild’s suffix',
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
      },
    },
  },
};
