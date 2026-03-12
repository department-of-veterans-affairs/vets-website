import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Veteran’s previous name'),
    'view:servedUnderOtherNames': yesNoUI(
      'Did the Veteran serve under another name?',
    ),
  },
  schema: {
    type: 'object',
    required: ['view:servedUnderOtherNames'],
    properties: {
      'view:servedUnderOtherNames': yesNoSchema,
    },
  },
};
