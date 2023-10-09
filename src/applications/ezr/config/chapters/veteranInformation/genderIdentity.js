import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  radioUI,
  descriptionUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SigiDescription from '../../../components/FormDescriptions/SigiDescription';
import content from '../../../locales/en/content.json';
import { SIGI_GENDERS } from '../../../utils/constants';

const { sigiGenders } = ezrSchema.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:pageTitle': inlineTitleUI(
      content['vet-gender-identity-title'],
      SigiDescription,
    ),
    sigiGenders: radioUI({
      title: content['vet-sigi-title'],
      labels: SIGI_GENDERS,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pageTitle': inlineTitleSchema,
      sigiGenders,
    },
  },
};
