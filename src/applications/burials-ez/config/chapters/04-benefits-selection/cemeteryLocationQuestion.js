import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { cemeteryTypeLabels } from '../../../utils/labels';

export default {
  uiSchema: {
    ...titleUI('Cemetery location'),
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
