import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import { DisabilityRatingDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const { vaCompensationType } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['benefits--disability-rating-title'],
      content['benefits--disability-rating-description'],
    ),
    ...descriptionUI(DisabilityRatingDescription),
    vaCompensationType: {
      'ui:title': content['benefits--disability-rating-label'],
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lowDisability: content['benefits--disability-rating-low-label'],
          highDisability: content['benefits--disability-rating-high-label'],
          none: content['form--default-no-label'],
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['vaCompensationType'],
    properties: {
      vaCompensationType,
    },
  },
};
