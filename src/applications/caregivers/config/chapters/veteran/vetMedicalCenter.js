import React from 'react';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { medicalCentersByState } from 'applications/caregivers/helpers';
import { states } from 'platform/forms/address';
import { veteranFields } from 'applications/caregivers/definitions/constants';
import {
  veteranPreferredFacilityName,
  veteranPreferredFacilityType,
  veteranPreferredFacility,
  preferredFacilityView,
} from 'applications/caregivers/definitions/UIDefinitions/veteranUI';

const plannedClinic = fullSchema.properties.veteran.properties.plannedClinic;
const lastTreatmentFacilityName =
  fullSchema.properties.veteran.properties.lastTreatmentFacilityName;
const lastTreatmentFacilityType =
  fullSchema.properties.veteran.properties.lastTreatmentFacilityType;

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
    [veteranFields.previousTreatmentFacilityName]: veteranPreferredFacilityName,
    [veteranFields.previousTreatmentFacilityType]: veteranPreferredFacilityType,
    [veteranFields.preferredFacilityView]: { ...preferredFacilityView },
    [veteranFields.preferredFacilityInfoView]: veteranPreferredFacility,
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.previousTreatmentFacilityName]: lastTreatmentFacilityName,
      [veteranFields.previousTreatmentFacilityType]: lastTreatmentFacilityType,
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
          [veteranFields.plannedClinic]: Object.assign({}, plannedClinic, {
            enum: [],
          }),
        },
      },
    },
  },
};

export default vetMedicalCenterPage;
