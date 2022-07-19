import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import get from 'platform/utilities/data/get';
import { states } from 'platform/forms/address';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { logValidateMarriageDateVaFacilityPage } from '../../../validation';

import {
  EssentialCoverageDescription,
  FacilityLocatorDescription,
} from '../../../components/FormDescriptions';
import { ShortFormAlert } from '../../../components/FormAlerts';
import {
  medicalCenterLabels,
  medicalCentersByState,
  HIGH_DISABILITY,
  emptyObjectSchema,
} from '../../../helpers';

const {
  vaMedicalFacility,
  isEssentialAcaCoverage,
  wantsInitialVaContact,
} = fullSchemaHca.properties;
const stateLabels = createUSAStateLabels(states);
const emptyFacilityList = [];

export default {
  uiSchema: {
    'view:facilityShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: form =>
          !form['view:hcaShortFormEnabled'] ||
          (form.vaCompensationType !== 'highDisability' &&
            !(
              form['view:totalDisabilityRating'] &&
              form['view:totalDisabilityRating'] >= HIGH_DISABILITY
            )),
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
        'ui:options': {
          labels: stateLabels,
        },
        'ui:validations': [logValidateMarriageDateVaFacilityPage],
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
