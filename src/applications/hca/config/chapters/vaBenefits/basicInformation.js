// @ts-check
import {
  titleUI,
  descriptionUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { DisabilityRatingDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(
      content['benefits--disability-rating-title'],
      content['benefits--disability-rating-description'],
    ),
    ...descriptionUI(DisabilityRatingDescription),
    vaCompensationType: radioUI({
      title: content['benefits--disability-rating-label'],
      labels: {
        lowDisability: content['benefits--disability-rating-low-label'],
        highDisability: content['benefits--disability-rating-high-label'],
        none: content['form--default-no-label'],
      },
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['vaCompensationType'],
    properties: {
      vaCompensationType: radioSchema([
        'lowDisability',
        'highDisability',
        'none',
      ]),
    },
  },
};
