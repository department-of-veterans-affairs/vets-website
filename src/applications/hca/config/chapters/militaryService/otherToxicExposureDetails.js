// @ts-check
import {
  titleUI,
  descriptionUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ExposureCategoriesLink } from '../../../components/FormDescriptions/OtherExposureDescriptions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(
      content['service-info--exposures-title'],
      content['service-info--exposures-description'],
    ),
    ...descriptionUI(ExposureCategoriesLink),
    otherToxicExposure: textUI({
      title: content['service-info--exposures-other-input-label'],
      errorMessages: {
        pattern: content['validation-error--other-exposures'],
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherToxicExposure: {
        ...textSchema,
        maxLength: 100,
        pattern: '^[a-zA-Z0-9,.?! ]*$',
      },
    },
  },
};
