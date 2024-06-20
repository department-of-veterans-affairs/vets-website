import React from 'react';

import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import get from 'platform/utilities/data/get';

import {
  medicalCenterLabels,
  medicalCentersByState,
  facilityNameMaxLength,
} from '../../utils/helpers';
import {
  FacilityInfoDescription,
  LastTreatmentFacilityDescription,
  PreferredFacilityDescription,
  PreferredFacilityAPIDescription,
} from '../../components/FormDescriptions';
// import VaMedicalCenter from '../../components/FormFields/VaMedicalCenter';
import { veteranFields } from '../constants';
import FacilitySearch from '../../components/FormFields/FacilitySearch';

const emptyFacilityList = [];
const stateLabels = createUSAStateLabels(states);

// veteran UI
export const vetInputLabel = 'Veteran\u2019s';

export const previousTreatmentFacilityUI = {
  'ui:title': ' ',
  'ui:order': ['name', 'type'],
  'ui:description': (
    <div className="vads-u-margin-top--neg2">
      <h3 className="vads-u-font-size--h4 vads-u-margin-top--0">
        Recent medical care
      </h3>
      <p>
        Please enter the name of the medical facility where the Veteran{' '}
        <strong>last received medical treatment.</strong>
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
  'ui:description': PreferredFacilityDescription,
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
  'ui:widget': FacilityInfoDescription,
};

/**
 * All UI declarations below this represent new UI utilized for the Facilities API implementation.
 * This entire file will be refactored upon successful merge & launch of the Factilities API use
 */
export const LastTreatmentFacilityAPIUI = {
  'ui:title': 'Recent medical care',
  'ui:description': LastTreatmentFacilityDescription,
  'ui:order': ['name', 'type'],
  name: {
    'ui:title': 'Name of medical facility',
    'ui:required': formData => !!formData.veteranLastTreatmentFacility.type,
    'ui:validations': [
      {
        validator: (errors, _fieldData, formData) => {
          facilityNameMaxLength(errors, formData);
        },
      },
    ],
  },
  type: {
    'ui:title': 'Was this a hospital or clinic?',
    'ui:required': formData => !!formData.veteranLastTreatmentFacility.name,
    'ui:options': {
      labels: {
        hospital: 'Hospital',
        clinic: 'Clinic',
      },
    },
  },
};

export const PreferredFacilityAPIUI = {
  'ui:title': 'The Veteran’s VA health care facility',
  'ui:description': PreferredFacilityAPIDescription,
  plannedClinic: {
    'ui:widget': FacilitySearch,
    'ui:options': {
      hideLabelText: true,
    },
    'ui:required': () => true,
  },
};
