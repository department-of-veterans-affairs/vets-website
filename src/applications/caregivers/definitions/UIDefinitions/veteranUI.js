import React from 'react';

import {
  FacilityInfo,
  PleaseSelectVAFacility,
} from 'applications/caregivers/components/AdditionalInfo';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import get from 'platform/utilities/data/get';
import { veteranFields } from '../constants';
import {
  medicalCenterLabels,
  medicalCentersByState,
  facilityNameMaxLength,
} from 'applications/caregivers/helpers';

const emptyFacilityList = [];
const stateLabels = createUSAStateLabels(states);

// veteran UI
export const vetInputLabel = 'Veteran\u2019s';

export const previousTreatmentFacilityUI = {
  'ui:title': ' ',
  'ui:order': ['name', 'type'],
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
  name: {
    'ui:required': formData => !!formData.veteranLastTreatmentFacility.type,
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          facilityNameMaxLength(errors, formData);
        },
      },
    ],
    'ui:title': 'Name of medical facility',
  },
  type: {
    'ui:required': formData => !!formData.veteranLastTreatmentFacility.name,
    'ui:title': 'Was this a hospital or clinic?',
    'ui:options': {
      labels: {
        hospital: 'Hospital',
        clinic: 'Clinic',
      },
    },
  },
};

// TODO: naming super confusing need to update
export const preferredFacilityView = {
  'ui:description': PleaseSelectVAFacility(),
  veteranFacilityState: {
    'ui:title': 'State',

    'ui:options': {
      labels: stateLabels,
    },
  },
  plannedClinic: {
    'ui:title': 'VA medical center',
    'ui:options': {
      labels: medicalCenterLabels,
      updateSchema: form => {
        const state = get(
          `${[veteranFields.preferredFacilityView]}.${[
            veteranFields.preferredFacilityStateView,
          ]}`,
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
};

// TODO: naming super confusing need to update
export const veteranPreferredFacility = {
  'ui:title': ' ',
  'ui:widget': FacilityInfo,
};
