// @ts-check
import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FacilityLocatorDescription } from '../../../components/FormDescriptions';
import VaMedicalCenter from '../../../components/FormFields/VaMedicalCenter';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(
      content['insurance-info--facility-title'],
      content['insurance-info--facility-description'],
    ),
    'view:preferredFacility': {
      'ui:field': VaMedicalCenter,
    },
    'view:locator': {
      ...descriptionUI(FacilityLocatorDescription),
    },
    wantsInitialVaContact: yesNoUI({
      title: content['insurance-info--appointment-label'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:preferredFacility': {
        type: 'object',
        required: ['view:facilityState', 'vaMedicalFacility'],
        properties: {
          'view:facilityState': {
            type: 'string',
          },
          vaMedicalFacility: {
            type: 'string',
          },
        },
      },
      'view:locator': emptyObjectSchema,
      wantsInitialVaContact: yesNoSchema,
    },
  },
};
