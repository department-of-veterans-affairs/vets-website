import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import set from 'platform/utilities/data/set';

import { ShortFormAlert } from '../../../components/FormAlerts';
import { isShortFormEligible } from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';

const { mothersMaidenName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:maidenNameShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: formData => !isShortFormEligible(formData),
      },
    },
    mothersMaidenName: {
      'ui:title': 'Mother\u2019s maiden name',
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:maidenNameShortFormMessage': emptyObjectSchema,
      mothersMaidenName: set('maxLength', 35, mothersMaidenName),
    },
  },
};
