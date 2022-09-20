import get from 'platform/utilities/data/get';
import { states } from 'platform/forms/address';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';

import {
  facilityHelp,
  isEssentialAcaCoverageDescription,
  medicalCenterLabels,
  medicalCentersByState,
} from '../../../helpers';

const {
  vaMedicalFacility,
  isEssentialAcaCoverage,
  wantsInitialVaContact,
} = fullSchemaHca.properties;

const stateLabels = createUSAStateLabels(states);

const emptyFacilityList = [];
const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema: {
    'ui:title': 'VA Facility',
    isEssentialAcaCoverage: {
      'ui:title': isEssentialAcaCoverageDescription,
    },
    'view:preferredFacility': {
      'ui:title': 'Select your preferred VA medical facility',
      'view:facilityState': {
        'ui:title': 'State',
        'ui:options': {
          labels: stateLabels,
        },
      },
      vaMedicalFacility: {
        'ui:title': 'Center or clinic',
        'ui:options': {
          labels: medicalCenterLabels,
          updateSchema: form => {
            const state = get(
              'view:preferredFacility.view:facilityState',
              form,
            );
            if (state) {
              return {
                enum: medicalCentersByState[state] || emptyFacilityList,
              };
            }

            return {
              enum: emptyFacilityList,
            };
          },
        },
      },
    },
    'view:locator': {
      'ui:description': facilityHelp,
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
      isEssentialAcaCoverage,
      'view:preferredFacility': {
        type: 'object',
        required: ['view:facilityState', 'vaMedicalFacility'],
        properties: {
          'view:facilityState': {
            type: 'string',
            enum: states.USA.map(state => state.value).filter(
              state => !!medicalCentersByState[state],
            ),
          },
          vaMedicalFacility: {
            ...vaMedicalFacility,
            enum: emptyFacilityList,
          },
        },
      },
      'view:locator': emptyObjectSchema,
      wantsInitialVaContact,
    },
  },
};
