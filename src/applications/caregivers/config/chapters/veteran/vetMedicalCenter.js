import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { medicalCentersByState } from 'applications/caregivers/helpers';
import { states } from 'platform/forms/address';
import { veteranFields } from 'applications/caregivers/definitions/constants';
import {
  previousTreatmentFacilityUI,
  veteranPreferredFacility,
  preferredFacilityView,
} from 'applications/caregivers/definitions/UIDefinitions/veteranUI';

const {
  lastTreatmentFacility,
  plannedClinic,
} = fullSchema.properties.veteran.properties;

const vetMedicalCenterPage = {
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

export default vetMedicalCenterPage;
