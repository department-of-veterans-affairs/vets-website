import React from 'react';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

import { states } from 'platform/forms/address';
import { vetFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';
import { medicalCentersByState } from 'applications/caregivers/helpers';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;
const lastTreatmentFacilityName =
  fullSchema.properties.veteran.properties.lastTreatmentFacilityName;
const lastTreatmentFacilityType =
  fullSchema.properties.veteran.properties.lastTreatmentFacilityType;

const { vetUI } = definitions;

const vetMedicalCenterPage = {
  uiSchema: {
    'ui:description': (
      <div>
        <h3 className="vads-u-font-size--h4">Recent medical care</h3>
        <p>
          Please enter the name of the medical facility where the Veteran
          <strong className="vads-u-margin-left--0p5">
            last received medical treatment.
          </strong>
        </p>
      </div>
    ),
    [vetFields.previousTreatmentFacilityName]: {
      'ui:title': 'Name of medical facility',
    },
    [vetFields.previousTreatmentFacilityType]: {
      'ui:title': 'Is this a hospital or clinic?',
    },
    [vetFields.preferredFacilityView]: {
      ...vetUI[vetFields.preferredFacilityView],
    },
    [vetFields.preferredFacilityInfoView]: vetUI.preferredFacilityInfo,
  },
  schema: {
    type: 'object',
    properties: {
      [vetFields.previousTreatmentFacilityName]: lastTreatmentFacilityName,
      [vetFields.previousTreatmentFacilityType]: lastTreatmentFacilityType,
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
