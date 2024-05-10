import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import {
  EssentialCoverageDescription,
  FacilityLocatorDescription,
} from '../../../components/FormDescriptions';
import ShortFormAlert from '../../../components/FormAlerts/ShortFormAlert';
import VaMedicalCenter from '../../../components/FormFields/VaMedicalCenter';
import { notShortFormEligible } from '../../../utils/helpers/form-config';
import { emptyObjectSchema } from '../../../definitions';

// define default schema properties
const {
  isEssentialAcaCoverage,
  wantsInitialVaContact,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:facilityShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: notShortFormEligible,
      },
    },
    'view:vaFacilityTitle': {
      'ui:title': 'VA facility',
    },
    isEssentialAcaCoverage: {
      'ui:title':
        'I’m enrolling to get minimum essential coverage under the Affordable Care Act.',
    },
    'view:isEssentialCoverageDesc': {
      'ui:description': EssentialCoverageDescription,
    },
    'view:preferredFacility': {
      'ui:field': VaMedicalCenter,
    },
    'view:locator': {
      'ui:description': FacilityLocatorDescription,
    },
    wantsInitialVaContact: {
      'ui:title':
        'Do you want VA to contact you to schedule your first appointment?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:facilityShortFormMessage': emptyObjectSchema,
      'view:vaFacilityTitle': emptyObjectSchema,
      isEssentialAcaCoverage,
      'view:isEssentialCoverageDesc': emptyObjectSchema,
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
