import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Cemetery location'),
    nationalOrFederal: {
      ...yesNoUI({
        title:
          'Was the Veteran buried in a VA national cemetery or another federal cemetery?',
        classNames: 'vads-u-margin-bottom--2',
      }),
      'ui:options': {
        classNames: 'vads-u-margin-top--0',
      },
    },
    name: {
      'ui:title': 'Name of cemetery',
      'ui:required': form => form?.nationalOrFederal,
      'ui:options': {
        hideIf: form => !form?.nationalOrFederal,
      },
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    required: ['nationalOrFederal'],
    properties: {
      nationalOrFederal: {
        type: 'boolean',
      },
      name: {
        type: 'string',
      },
    },
  },
};
