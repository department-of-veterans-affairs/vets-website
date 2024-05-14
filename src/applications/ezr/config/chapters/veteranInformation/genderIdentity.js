import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  radioUI,
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import SigiDescription from '../../../components/FormDescriptions/SigiDescription';
import content from '../../../locales/en/content.json';
import { SIGI_GENDERS } from '../../../utils/constants';

const { sigiGenders } = ezrSchema.properties;

export default {
  uiSchema: {
    'view:sigiGenders': {
      ...titleUI(content['vet-gender-identity-title']),
      ...descriptionUI(SigiDescription, { hideOnReview: true }),
      sigiGenders: radioUI({
        title: content['vet-sigi-title'],
        labels: SIGI_GENDERS,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:sigiGenders': {
        type: 'object',
        properties: {
          sigiGenders,
        },
      },
    },
  },
};
