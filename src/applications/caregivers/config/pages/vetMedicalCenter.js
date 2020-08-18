import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { medicalCentersByState } from 'applications/caregivers/helpers';
import { states } from 'platform/forms/address';
import { VetInfo } from 'applications/caregivers/components/AdditionalInfo';
import { vetFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;
const { vetUI } = definitions;

const vetMedicalCenterPage = {
  uiSchema: {
    'ui:description': VetInfo({
      pageTitle: 'VA medical center',
    }),
    [vetFields.previousTreatmentFacility]: vetUI.previousTreatmentFacilityUI,
    [vetFields.preferredFacilityView]: {
      ...vetUI[vetFields.preferredFacilityView],
    },
    [vetFields.preferredFacilityInfoView]: vetUI.preferredFacilityInfo,
  },
  schema: {
    type: 'object',
    properties: {
      // TODO: update using full schema
      [vetFields.previousTreatmentFacility]: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'type'],
        properties: {
          name: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['hospital', 'clinic'],
          },
        },
      },
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
      // facility additional info section - noop property
      [vetFields.preferredFacilityInfoView]: {
        type: 'string',
      },
    },
  },
};

export default vetMedicalCenterPage;
