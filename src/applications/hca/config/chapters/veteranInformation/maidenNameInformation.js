import set from 'platform/utilities/data/set';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import { ShortFormMessage } from '../../../components/FormAlerts';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

const { mothersMaidenName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:maidenNameShortFormMessage': {
      'ui:description': ShortFormMessage,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
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
