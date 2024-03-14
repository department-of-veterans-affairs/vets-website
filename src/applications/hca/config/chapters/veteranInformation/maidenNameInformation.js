import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import set from 'platform/utilities/data/set';

import ShortFormAlert from '../../../components/FormAlerts/ShortFormAlert';
import { notShortFormEligible } from '../../../utils/helpers/form-config';
import { emptyObjectSchema } from '../../../definitions';

const { mothersMaidenName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:maidenNameShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: notShortFormEligible,
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
