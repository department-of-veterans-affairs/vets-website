import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import constants from 'vets-json-schema/dist/constants.json';
import { veteranFields } from '../../../definitions/constants';
import {
  LastTreatmentFacilityAPIUI,
  PreferredFacilityAPIUI,
} from '../../../definitions/UIDefinitions/veteranUI';

const {
  lastTreatmentFacility,
  plannedClinic,
} = fullSchema.properties.veteran.properties;
const caregiverStates = constants.states50AndDC
  .concat([{ label: 'Puerto Rico', value: 'PR' }])
  .sort((stateA, stateB) => stateA.label.localeCompare(stateB.label));

const vetMedicalCenterAPIPage = {
  uiSchema: {
    [veteranFields.previousTreatmentFacility]: LastTreatmentFacilityAPIUI,
    [veteranFields.preferredFacilityView]: PreferredFacilityAPIUI,
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.previousTreatmentFacility]: lastTreatmentFacility,
      [veteranFields.preferredFacilityView]: {
        type: 'object',
        properties: {
          veteranFacilityState: {
            type: 'string',
            enum: caregiverStates.map(object => object.value),
            enumNames: caregiverStates.map(object => object.label),
          },
          plannedClinic,
        },
      },
    },
  },
};

export default vetMedicalCenterAPIPage;
