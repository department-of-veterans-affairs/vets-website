import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { states } from 'platform/forms/address';
import { medicalCentersByState } from '../../../utils/helpers';
import { veteranFields } from '../../../definitions/constants';
import {
  previousTreatmentFacilityUI,
  veteranPreferredFacility,
  preferredFacilityView,
} from '../../../definitions/UIDefinitions/veteranUI';

const {
  lastTreatmentFacility,
  plannedClinic,
} = fullSchema.properties.veteran.properties;

const vetMedicalCenterJsonPage = {
  uiSchema: {
    [veteranFields.previousTreatmentFacility]: previousTreatmentFacilityUI,
    [veteranFields.preferredFacilityView]: { ...preferredFacilityView },
    [veteranFields.preferredFacilityInfoView]: veteranPreferredFacility,
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.previousTreatmentFacility]: lastTreatmentFacility,
      // dynamic properties for filtering facilities dropDown
      [veteranFields.preferredFacilityView]: {
        type: 'object',
        required: [
          veteranFields.preferredFacilityStateView,
          veteranFields.plannedClinic,
        ],
        properties: {
          [veteranFields.preferredFacilityStateView]: {
            type: 'string',
            enum: states.USA.map(state => state.value).filter(
              state => !!medicalCentersByState[state],
            ),
          },
          [veteranFields.plannedClinic]: { ...plannedClinic, enum: [] },
        },
      },
    },
  },
};

export default vetMedicalCenterJsonPage;
