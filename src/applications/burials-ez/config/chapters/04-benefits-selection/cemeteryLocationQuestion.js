import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { cemeteryTypeLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Cemetery location'),
    cemetaryLocationQuestion: radioUI({
      title:
        'Was the Veteran buried in a state cemetery or on tribal trust land (like a tribal cemetery)?',
      labels: cemeteryTypeLabels,
    }),
  },
  schema: {
    type: 'object',
    required: ['cemetaryLocationQuestion'],
    properties: {
      cemetaryLocationQuestion: radioSchema(Object.keys(cemeteryTypeLabels)),
    },
  },
};
