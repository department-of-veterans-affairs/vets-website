import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import { SIGIGenderDescription } from '../../../components/FormDescriptions';
import { ShortFormAlert } from '../../../components/FormAlerts';
import { NotHighDisability } from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';

const { sigiGenders } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:genderShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: NotHighDisability,
      },
    },
    'view:prefillMessage': {
      'ui:description': PrefillMessage,
    },
    'view:genderIdentity': {
      'ui:title': 'Gender identity',
      'ui:description': SIGIGenderDescription,
      sigiGenders: {
        'ui:title': 'Select your gender identity',
        'ui:reviewField': CustomReviewField,
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            NB: 'Non-binary',
            M: 'Man',
            F: 'Woman',
            TM: 'Transgender man',
            TF: 'Transgender woman',
            O: 'A gender not listed here',
            NA: 'Prefer not to answer',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      'view:genderShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
      'view:genderIdentity': {
        type: 'object',
        properties: {
          sigiGenders,
        },
      },
    },
  },
};
