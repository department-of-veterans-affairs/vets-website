import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import constants from 'vets-json-schema/dist/constants.json';
import { STATES_WITHOUT_MEDICAL } from '../../../utils/constants';
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

// define states/territories with health care facilities
const healthcareStates = constants.states.USA.filter(state => {
  return !STATES_WITHOUT_MEDICAL.includes(state.value);
});

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
      'ui:title': 'Select your preferred VA medical facility',
      'view:facilityState': {
        'ui:title': 'State',
      },
      vaMedicalFacility: {
        'ui:title': 'Center or clinic',
        'ui:widget': VaMedicalCenter,
        'ui:options': {
          hideLabelText: true,
        },
      },
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
            enum: healthcareStates.map(object => object.value),
            enumNames: healthcareStates.map(object => object.label),
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
