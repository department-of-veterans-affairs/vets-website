import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { medicalCentersByState } from 'applications/caregivers/helpers';
import { states } from 'platform/forms/address';
import { vetFields } from 'applications/caregivers/definitions/constants';
import {
  previousTreatmentFacilityUI,
  veteranPreferredFacility,
  preferredFacilityView,
} from 'applications/caregivers/definitions/caregiverUI';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;
const lastTreatmentFacility =
  fullSchema.properties.veteran.properties.lastTreatmentFacility;

const vetMedicalCenterPage = {
  uiSchema: {
    [vetFields.previousTreatmentFacility]: previousTreatmentFacilityUI,
    [vetFields.preferredFacilityView]: { ...preferredFacilityView },
    [vetFields.preferredFacilityInfoView]: veteranPreferredFacility,
  },
  schema: {
    type: 'object',
    properties: {
      [vetFields.previousTreatmentFacility]: lastTreatmentFacility,
      // dynamic properties for filtering facilities dropDown
      [vetFields.preferredFacilityView]: {
        type: 'object',
        required: [
          vetFields.preferredFacilityStateView,
          vetFields.plannedClinic,
        ],
        properties: {
          [vetFields.preferredFacilityStateView]: {
            type: 'string',
            enum: states.USA.map(state => state.value).filter(
              state => !!medicalCentersByState[state],
            ),
          },
          [vetFields.plannedClinic]: Object.assign({}, plannedClinic, {
            enum: [],
          }),
        },
      },
    },
  },
};

export default vetMedicalCenterPage;
