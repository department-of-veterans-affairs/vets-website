import {
  textUI,
  textSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Cemetery location'),
    nationalOrFederal: yesNoUI(
      'Was the Veteran buried in a VA national cemetery or another federal cemetery?',
    ),
    name: textUI({
      title: 'Name of cemetery',
      required: form => form?.nationalOrFederal,
      hideIf: form => !form?.nationalOrFederal,
    }),
  },
  schema: {
    type: 'object',
    required: ['nationalOrFederal'],
    properties: {
      nationalOrFederal: yesNoSchema,
      name: textSchema,
    },
  },
};
