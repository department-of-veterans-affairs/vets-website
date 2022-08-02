import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import { genderLabels } from 'platform/static-data/labels';

import { ShortFormAlert } from '../../../components/FormAlerts';
import CustomReviewField from '../../../components/CustomReviewField';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

const { gender } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:birthSexShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
      },
    },
    'view:prefillMessage': {
      'ui:description': PrefillMessage,
    },
    gender: {
      'ui:title': 'What sex were you assigned at birth?',
      'ui:reviewField': CustomReviewField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: genderLabels,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['gender'],
    properties: {
      'view:birthSexShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
      gender,
    },
  },
};
