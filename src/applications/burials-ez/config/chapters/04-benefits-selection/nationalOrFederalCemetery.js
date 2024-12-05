import {
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Cemetery location'),
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
