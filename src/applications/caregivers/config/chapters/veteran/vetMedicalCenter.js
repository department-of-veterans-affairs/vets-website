import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

import definitions from 'applications/caregivers/definitions/caregiverUI';
import { medicalCentersByState } from 'applications/caregivers/helpers';
import { vetFields } from 'applications/caregivers/definitions/constants';
import { FacilityInfo } from 'applications/caregivers/components/AdditionalInfo';
import { states } from 'platform/forms/address';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;
const lastTreatmentFacility =
  fullSchema.properties.veteran.properties.lastTreatmentFacility;
const { vetUI } = definitions;

const vetMedicalCenterPage = {
  uiSchema: {
    [vetFields.previousTreatmentFacility]: vetUI.previousTreatmentFacilityUI,
    [vetFields.preferredFacilityView]: {
      ...vetUI[vetFields.preferredFacilityView],
    },
    [vetFields.preferredFacilityInfoView]: {
      'ui:title': ' ',
      'ui:widget': FacilityInfo,
    },
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
