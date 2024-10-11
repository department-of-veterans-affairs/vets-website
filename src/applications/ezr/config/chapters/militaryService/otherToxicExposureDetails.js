import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import OtherToxicExposureDescription from '../../../components/FormDescriptions/OtherToxicExposureDescription';
import content from '../../../locales/en/content.json';

const { otherToxicExposure } = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['military-service-other-exposure-title-2'],
      content['military-service-other-exposure-description'],
    ),
    'ui:description': OtherToxicExposureDescription,
    otherToxicExposure: {
      'ui:title': content['military-service-other-exposure-description-2'],
      'ui:errorMessages': {
        pattern: content['military-service-other-exposure-error-message'],
      },
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherToxicExposure,
    },
  },
};
