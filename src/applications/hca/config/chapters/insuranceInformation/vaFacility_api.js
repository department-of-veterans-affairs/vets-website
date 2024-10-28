import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FacilityLocatorDescription } from '../../../components/FormDescriptions';
import VaMedicalCenter from '../../../components/FormFields/VaMedicalCenter';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

const { wantsInitialVaContact } = fullSchemaHca.properties;

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
      'ui:description': FacilityLocatorDescription,
    },
    wantsInitialVaContact: {
      'ui:title': content['insurance-info--appointment-label'],
      'ui:widget': 'yesNo',
    },
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
      wantsInitialVaContact,
    },
  },
};
