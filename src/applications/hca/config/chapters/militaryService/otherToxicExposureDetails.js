import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ExposureCategoriesLink } from '../../../components/FormDescriptions/OtherExposureDescriptions';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { otherToxicExposure } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['service-info--exposures-title'],
      content['service-info--exposures-description'],
    ),
    ...descriptionUI(ExposureCategoriesLink),
    otherToxicExposure: {
      'ui:title': content['service-info--exposures-other-input-label'],
      'ui:errorMessages': {
        pattern: content['validation-error--other-exposures'],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherToxicExposure,
    },
  },
};
